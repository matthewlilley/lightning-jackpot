import { IncomingMessage, Server, ServerResponse } from 'http'
import { Logger, LoggerInterface } from './logger'
import { Next, NextRequestHandler } from './next-decorator'
import RedisStatic, { Redis } from 'ioredis'
import { UrlWithParsedQuery, parse } from 'url'
import connectRedis, { RedisStore } from 'connect-redis'
import express, { Express } from 'express'
import io, { Server as SocketIoServer } from 'socket.io'
import { ioRedisConfig, routingControllersConfig } from './config'

import { Developer } from './admin'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { default as NextServer } from 'next-server/dist/server/next-server'
import { RedisClient } from './redis'
import { Service } from 'typedi'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { UserRepository } from './users'
import arena from 'bull-arena'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { createServer } from 'https'
import { expressErrorHandler } from '@pm2/io'
import { getCustomRepository } from 'typeorm'
import { join } from 'path'
import passport from 'passport'
import { readFileSync } from 'fs'
import { middleware as requestCountry } from 'request-country'
import { mw as requestIp } from 'request-ip'
import session from 'express-session'
import sharedSession from 'express-socket.io-session'
import { socialHandler } from './auth'
import { useExpressServer } from 'routing-controllers'
import useSocketIo from './io'

const RedisSessionStore: RedisStore = connectRedis(session)

// var rootCas = require('ssl-root-cas/latest').create()

// // default for all https requests
// // (whether using https directly, request, or another module)
// require('https').globalAgent.options.ca = rootCas

@Service()
class LightningJackpot {
  @RedisClient()
  private readonly redis: Redis
  @Logger()
  private readonly logger: LoggerInterface
  @Next()
  private readonly next: NextServer
  @NextRequestHandler()
  private readonly handle: (
    req: IncomingMessage,
    res: ServerResponse,
    parsedUrl?: UrlWithParsedQuery | undefined
  ) => Promise<void>
  private readonly express: Express = express()
  private readonly server = new Server(this.express)
  // private readonly server = createServer(this.express)
  private readonly io: SocketIoServer = io(this.server)
  private readonly session = session({
    secret: String(process.env.APP_SECRET),
    name: 'lnjp.sid',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
    store: new RedisSessionStore({
      client: new RedisStatic(ioRedisConfig) as any,
    }),
  })
  async bootstrap() {
    try {
      this.logger.info('⚡ ⚡ ⚡  Initilising Lightning Jackpot ⚡ ⚡ ⚡')

      passport.use(
        new FacebookStrategy(
          {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `${process.env.APP_URL}/auth/facebook/callback`,
          },
          socialHandler
        )
      )

      passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.APP_URL}/auth/google/callback`,
          },
          socialHandler
        )
      )

      passport.use(
        new TwitterStrategy(
          {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: `${process.env.APP_URL}/auth/twitter/callback`,
          },
          socialHandler
        )
      )

      passport.serializeUser((user, done) => {
        // logger.debug('serializeUser', user)
        done(null, user.id)
      })

      passport.deserializeUser(async (id, done) => {
        try {
          // logger.debug('deserializeUser', id)
          const user = await getCustomRepository(UserRepository).findById(id)
          done(null, user)
        } catch (error) {
          return done(error, null)
        }
      })

      this.logger.info('Next prepare...')
      await this.next.prepare()

      this.express.use(this.session)

      this.io.use(
        sharedSession(this.session, {
          autoSave: false,
        })
      )
      useSocketIo(this.io)

      this.logger.info('Express...')
      this.express.disable('x-powered-by')

      // trust 1st proxy
      // this.express.set('trust proxy', process.env.TRUST_PROXY || 1)

      // this.express.use(
      //   '/.well-known',
      //   express.static(join(__dirname, '.well-known'))
      // )

      this.express.use((req, res, next) => {
        if (!req.session) {
          return next(new Error('No session found...'))
        }
        next()
      })

      // Use cookie parser
      this.express.use(cookieParser())

      // Use body parser
      this.express.use(bodyParser.json())
      this.express.use(bodyParser.urlencoded({ extended: false }))

      this.logger.debug('Passport initilise')
      this.express.use(passport.initialize())
      this.express.use(passport.session())

      // const client = new Redis(ioRedisConfig);

      // Use request ip
      this.express.use(requestIp())

      // Use request country
      this.express.use(
        requestCountry({
          attributeName: 'requestCountryCode', // default is 'requestCountryCode'
          privateIpCountry: 'PRIVATE', // Result for private network IPs
        })
      )

      // // Passwordless session support
      // this.express.use(passwordless.sessionSupport())

      // // Passwordless accept token
      // this.express.use(passwordless.acceptToken({ successRedirect: '/' }))

      // if (!dev) {
      //   app.use(expressErrorHandler());
      // }

      // this.express.use((req, res, next) => {
      //   // Send the Surrogate-Control header to announce ESI support to proxies (optional with Varnish)
      //   res.set('Surrogate-Control', 'content="ESI/1.0"');
      //   next();
      // });

      // this.express.get(path, (req, res) =>
      //   serveFragment(
      //     req,
      //     res,
      //     fragmentID => require(`./components/${fragmentID}`).default,
      //   ),
      // );

      // Redirect the user to Facebook for authentication.  When complete,
      // Facebook will redirect the user back to the application at
      //     /auth/facebook/callback
      this.express.get('/auth/facebook', passport.authenticate('facebook'))

      // Facebook will redirect the user to this URL after approval.  Finish the
      // authentication process by attempting to obtain an access token.  If
      // access was granted, the user will be logged in.  Otherwise,
      // authentication has failed.
      this.express.get(
        '/auth/facebook/callback',
        passport.authenticate('facebook', {
          successRedirect: '/',
          failureRedirect: '/login',
        })
      )

      // GET /auth/google
      //   Use passport.authenticate() as route middleware to authenticate the
      //   request.  The first step in Google authentication will involve
      //   redirecting the user to google.com.  After authorization, Google
      //   will redirect the user back to this application at /auth/google/callback
      this.express.get(
        '/auth/google',
        passport.authenticate('google', {
          scope: ['https://www.googleapis.com/auth/plus.login'],
        })
      )

      // GET /auth/google/callback
      //   Use passport.authenticate() as route middleware to authenticate the
      //   request.  If authentication fails, the user will be redirected back to the
      //   login page.  Otherwise, the primary route function function will be called,
      //   which, in this example, will redirect the user to the home page.
      this.express.get(
        '/auth/google/callback',
        passport.authenticate('google', {
          successRedirect: '/',
          failureRedirect: '/login',
        })
      )

      // Redirect the user to Twitter for authentication.  When complete, Twitter
      // will redirect the user back to the application at
      //   /auth/twitter/callback
      this.express.get('/auth/twitter', passport.authenticate('twitter'))

      // Twitter will redirect the user to this URL after approval.  Finish the
      // authentication process by attempting to obtain an access token.  If
      // access was granted, the user will be logged in.  Otherwise,
      // authentication has failed.
      this.express.get(
        '/auth/twitter/callback',
        passport.authenticate('twitter', {
          successRedirect: '/',
          failureRedirect: '/login',
        })
      )

      useExpressServer(this.express, routingControllersConfig)

      this.express.use(
        '/arena',
        [new Developer().use],
        arena(
          {
            queues: [
              {
                // Name of the bull queue, this name must match up exactly with what you've defined in bull.
                name: 'email',

                // Hostname or queue prefix, you can put whatever you want.
                hostId: 'lightningjackpot',

                // Redis auth.
                redis: ioRedisConfig,
              },
              {
                name: 'invoice',
                hostId: 'lightningjackpot',
                redis: ioRedisConfig,
              },
            ],
          },
          {
            // Let express handle the listening.
            disableListen: true,
          }
        )
      )

      this.express.get('*', (req, res) => {
        // if (res.finished || res.headersSent) {
        //   this.logger.debug('res.finished || res.headersSent', req.url)
        //   return
        // }
        return this.handle(req, res, parse(req.url, true))
      })

      this.logger.info('Listen...')
      this.server
        .listen(process.env.APP_PORT || 1337, () => {
          this.logger.info(
            `> Server listening ${JSON.stringify(this.server.address())}`
          )
        })
        .on('error', (error: NodeJS.ErrnoException) => {
          this.logger.error('Bootstrap error:', error, error.stack)
        })
    } catch (error) {
      this.logger.error('Lightning Jackpot onStart Error', error)
    } finally {
      this.logger.info('Lightning Jackpot onStart Finally')
    }
  }
}

export default LightningJackpot
