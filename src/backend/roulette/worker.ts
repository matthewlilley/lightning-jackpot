import { Abstract, Game } from '../games'
import { Channel, Client as DiscordClient } from 'discord.js'
import {
  Connection,
  EntityManager,
  createConnection,
  useContainer as ormUseContainer,
} from 'typeorm'
import { Container, Service } from 'typedi'
import { Discord, DiscordChannel } from '../discord'
import { InjectConnection, InjectManager } from 'typeorm-typedi-extensions'
import {
  InstanceStatus,
  ProgressiveJackpotStrategy,
  RouletteStrategy,
  outcome,
  sleep,
  winningNumberToType,
} from '@lightning-jackpot/common'
import { System as ProvablyFair, createSystem } from 'provably-fair-framework'
import config, { RouletteConfig } from './config'
import { getDatabaseConfig, ioRedisConfig } from '../config'
import logger, { Logger, LoggerInterface } from '../logger'
import pmx, { Entrypoint } from '@pm2/io'

import { ExchangeRate } from '../accounting'
import { Instance } from '../instances'
import { Jackpot } from '../jackpots'
import { MessageRepository } from '../messages'
import RedisStatic from 'ioredis'
import { RouletteService } from '.'
import { SeedPair } from '../seeds'
import { classToPlain } from 'class-transformer'
import moment from 'moment'
import { performance } from 'perf_hooks'
import socketIoEmitter from 'socket.io-emitter'

ormUseContainer(Container)

@Service()
export class Roulette extends Abstract {
  private readonly name = 'roulette'

  private readonly messages: MessageRepository = Container.get(
    MessageRepository
  )

  @Logger()
  private readonly logger: LoggerInterface

  checking = false

  private shutdown = false

  @InjectConnection('roulette')
  private readonly connection: Connection

  @InjectManager('roulette')
  private readonly entityManager: EntityManager

  private game: Game

  private exchangeRate: ExchangeRate

  private readonly config: RouletteConfig = config

  private readonly emitter = socketIoEmitter(new RedisStatic(ioRedisConfig))

  private readonly provablyFair: ProvablyFair = createSystem({
    algorithm: 'sha256',
    strategies: [RouletteStrategy, ProgressiveJackpotStrategy],
    strategy: RouletteStrategy,
  })

  @Discord()
  private readonly discord: DiscordClient

  @DiscordChannel()
  private channel: any | Channel

  async reload(): Promise<void> {
    try {
      const game = await this.connection
        .createQueryBuilder(Game, 'game')
        .leftJoinAndSelect('game.balance', 'balance')
        .leftJoinAndSelect('game.jackpot', 'jackpot')
        .leftJoinAndSelect('game.instance', 'instance')
        .leftJoinAndSelect('instance.bets', 'bets')
        .where('game.name = :name', { name: this.name })
        .getOne()

      if (!game) {
        throw new Error('No game!')
      }

      this.game = game

      this.exchangeRate = await this.getExchangeRate()

      if (
        moment(this.exchangeRate.createdAt).isBefore(
          moment().subtract(24, 'hours')
        )
      ) {
        this.logger.error('Exchange rate being used is more than 24 hours old!')
      }
    } finally {
      // await masterQueryRunner.release()
    }
  }

  async getExchangeRate() {
    const exchangeRate = await this.connection
      .createQueryBuilder(ExchangeRate, 'exchangeRate')
      .orderBy('exchangeRate.id', 'DESC')
      .getOne()

    if (!exchangeRate) {
      throw new Error('No exchange rate!')
    }

    return exchangeRate
  }

  async initialise(): Promise<void> {
    this.logger.info(`Initilising ${this.name}`)

    try {
      await this.reload()

      // this.logger.debug('Game:', this.game)

      if (!this.game.instanceId) {
        throw new Error('No game instance...')
      }

      // if (
      //   !Array.isArray(this.game.instances) ||
      //   this.game.instances.length === 0
      // ) {
      //   throw new Error('No instances...')
      // }

      if (process.env.BOT === 'true') {
        this.discord.on('ready', () => {
          this.logger.info('Discord ready...')

          this.discord.user.setPresence({
            game: {
              name: 'Roulette',
              type: 'WATCHING',
            },
          })

          this.channel = this.discord.channels.get(
            String(process.env.DISCORD_CHANNEL_ID)
          )
          this.logger.info(`Logged in as ${this.discord.user.tag}!`)
          this.channel.send(`Logged in as ${this.discord.user.tag}!`)
        })

        this.discord.on('message', async message => {
          if (message.content === 'ping') {
            message.reply('pong')
          }

          const prefix = '!'
          if (!message.content.startsWith(prefix) || message.author.bot) return

          const args = message.content.slice(prefix.length).split(' ')

          const command = args.shift() || 'help'

          this.logger.debug('Command', command)
          this.logger.debug('Args', args)

          if (command === 'help') {
            return message.channel.send(`Some help message!`)
          } else if (command === 'broadcast') {
            this.logger.debug('broadcast')
            if (!args.length) {
              return message.channel.send(
                `You didn't provide an message, ${message.author}!`
              )
            }
            message.channel.send(`Command name: ${command}\nArguments: ${args}`)

            this.emitter.emit(
              'global',
              await this.messages.create({
                id: moment().unix(),
                tags: [
                  { text: 'SYSTEM', color: 'purple' },
                  { text: 'ANNOUCEMENT', color: 'green' },
                ],
                value: args.join(' '),
              })
            )

            message.reply(`broadcasting message "${args.join(' ')}"`)
          }
        })

        this.discord.on('error', error => {
          this.logger.error('discord on error', error)
        })

        this.discord.login(process.env.DISCORD_TOKEN)
      }
      this.logger.info(`Initilised ${this.name}`)
    } catch (error) {
      // this.logger.error(`Error initilising ${this.name}`);
      this.logger.error(`Error initilising ${this.name}`, error)
      if (this.channel) {
        this.channel.send(
          '```❌ Roulette: Error initilising ' +
            error.name +
            ' ❌ \n\n' +
            error.message +
            '```'
        )
      }
      throw error
    } finally {
      this.logger.info(`Initilising ${this.name} finally`)
    }
  }

  progressiveJackpotOdds(exchangeRate: number): number {
    const oneMillionDollarsInSatoshi = exchangeRate * 1000000
    return oneMillionDollarsInSatoshi
  }

  async check(): Promise<void> {
    try {
      this.checking = true

      this.logger.info(`Checking instance #${this.game.instanceId}...`)

      await this.reload()

      if (!this.game.instance.bets.length) {
        this.game.instance.state = {
          startedAt: moment().unix() + this.config.countdownDuration,
        }

        await this.entityManager.update(Instance, this.game.instance.id, {
          state: this.game.instance.state,
        })

        this.emitter.emit('instanceUpdated', {
          state: this.game.instance.state,
        })

        this.logger.info(
          `No bets, instance will be delayed ${this.config.countdownDuration} seconds`
        )
        return
      }

      this.logger.debug(
        `Instance has ${this.game.instance.bets.length} bets, proceed...`
      )

      const start = performance.now()

      if (this.game.instance.status === InstanceStatus.default) {
        const seedPair = await this.entityManager.findOneOrFail(SeedPair, {
          select: ['id'],
          relations: ['serverSeed', 'clientSeed'],
          order: { id: 'DESC' },
        })

        this.game.instance.state.winningNumber = !this.provablyFair.calculate(
          ProgressiveJackpotStrategy,
          [
            seedPair.serverSeed.value,
            `${seedPair.clientSeed.value}:${String(this.game.instance.id)}`,
            this.game.instance.value, // min
            this.progressiveJackpotOdds(this.exchangeRate.value), // max
          ]
        )
          ? this.provablyFair.calculate([
              seedPair.serverSeed.value,
              `${seedPair.clientSeed.value}:${String(this.game.instance.id)}`,
            ])
          : 15

        this.game.instance.state.winningType = winningNumberToType(
          Number(this.game.instance.state.winningNumber)
        )

        await this.entityManager.update(Instance, this.game.instance.id, {
          state: {
            ...this.game.instance.state,
            preset:
              !this.game.instance.jackpotInstance() ||
              (Math.floor(Math.random() * (100 - 1)) + 1) / 100 >
                this.config.teaserProbability
                ? undefined
                : 1,
          },
          status: InstanceStatus.live,
          seedPair,
          jackpotId: !this.game.instance.jackpotInstance()
            ? undefined
            : this.game.jackpotId,
        })
      }

      this.emitter.emit('instanceUpdated', {
        state: this.game.instance.state,
      })

      await sleep(this.config.spinDuration * 1000)

      if (this.channel) {
        this.channel.send(
          '```🎲 Roulette Roll 🎲 \n\n' +
            JSON.stringify(
              {
                id: this.game.instance.id,
                winningNumber: this.game.instance.state.winningNumber,
                winningType: this.game.instance.state.winningType,
                value: this.game.instance.value,
              },
              null,
              2
            ) +
            '```'
        )
      }

      this.game.instance.bets = this.game.instance.bets.map(bet => {
        bet.outcome = outcome(
          bet.state.type,
          bet.value,
          bet.state.type === this.game.instance.state.winningType,
          this.game.instance.value,
          this.game.instance.jackpotInstance(),
          this.game.jackpot.value
        )
        return bet
      })

      // Pay...
      await this.entityManager.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(this.game.instance.bets)

        await sleep(this.config.endDuration * 1000)

        await transactionalEntityManager.update(
          Instance,
          this.game.instance.id,
          {
            status: InstanceStatus.complete,
          }
        )

        if (this.game.instance.jackpotInstance()) {
          this.game.jackpot = await transactionalEntityManager.save(
            Jackpot,
            transactionalEntityManager.create(Jackpot)
          )
          await transactionalEntityManager.update(Game, this.game.id, {
            jackpot: this.game.jackpot,
          })
          this.emitter.emit('jackpotCreated', this.game.jackpot.value)
        }

        this.game.instance = await transactionalEntityManager.save(
          Instance,
          transactionalEntityManager.create(Instance, {
            gameId: this.game.id,
            bets: [],
          })
        )

        await transactionalEntityManager.update(Game, this.game.id, {
          instance: this.game.instance,
        })
        this.emitter.emit(
          'instanceCreated',
          classToPlain(this.game.instance, { groups: ['latest', 'roulette'] })
        )
      })

      const end = performance.now()
      this.logger.debug(`Roulette logic took ${end - start} milliseconds.`)
    } catch (error) {
      this.logger.error('Roulette check error', error)
      if (this.channel) {
        this.channel.send(
          '```❌Roulette: check' +
            error.name +
            ' ❌ \n\n' +
            error.message +
            '```'
        )
      }
      throw error
    } finally {
      this.logger.info('Roulette check complete')
      this.checking = false
    }
  }

  async run() {
    if (this.shutdown) {
      this.checking = false
      return
    }

    await sleep(1000 * this.config.countdownDuration)

    await this.check()

    this.run()
  }

  start(): void {
    this.logger.info(`Starting ${this.name}`)

    this.run()

    this.logger.info(`Started ${this.name}`)
  }

  stop(): void {
    this.logger.info(`Stopping ${this.name}`)

    this.shutdown = true

    this.logger.info(`Stopped ${this.name}`)
  }

  restart(): void {
    this.logger.info(`Restarting ${this.name}`)

    this.stop()

    this.start()

    this.logger.info(`Restarted ${this.name}`)
  }
}

new (class extends Entrypoint {
  private roulette: Roulette
  private connection: Connection
  async onStart(callback: (error?: Error) => void) {
    try {
      logger.info('Roulette onStart')

      await createConnection({
        ...(await getDatabaseConfig()),
        name: 'roulette',
      })

      logger.info(
        'Databse connection established for roulette, initialising roulette...'
      )

      this.roulette = Container.get(Roulette)
      await this.roulette.initialise()
      this.roulette.start()

      logger.info('Roulette started')

      callback()
    } catch (error) {
      logger.error('Roulette onStart error')
      callback(error)
    }
  }

  async onStop(
    error: Error,
    callback: () => void,
    code: number,
    signal: string
  ) {
    logger.info(
      'Roulette onStop',
      JSON.stringify({ error, callback, code, signal })
    )

    this.roulette.stop()

    while (this.roulette.checking) {
      logger.info(
        "Its unsafe to terminate Roulette as it's still running. Waiting 3 seconds before trying again."
      )
      await sleep(3000)
    }

    logger.info('Its safe to terminate Roulette.')

    callback()
  }

  // Here we declare some process metrics
  sensors(): void {
    //
  }

  // Here are some actions to interact with the app in live
  actuators(): void {
    // io.action('roulette:start', callback => {
    //   this.roulette
    //     .start()
    //     .then(() => {
    //       callback({ success: true });
    //     })
    //     .catch(error => callback({ success: false }));
    // });
    // io.action('roulette:stop', callback => {
    //   this.roulette
    //     .stop()
    //     .then(() => {
    //       callback({ success: true });
    //     })
    //     .catch(error => callback({ success: false }));
    // });
    // io.action('roulette:restart', callback => {
    //   this.roulette
    //     .restart()
    //     .then(() => {
    //       callback({ success: true });
    //     })
    //     .catch(error => callback({ success: false }));
    // });
    pmx.action('getEnv', reply => {
      reply(process.env)
    })
  }
})()
