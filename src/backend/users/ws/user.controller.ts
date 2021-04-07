import { Storage } from '@google-cloud/storage'
import { validate } from 'class-validator'
import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
} from 'socket-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Logger, LoggerInterface } from '../../logger'
import { User } from '../../users'

@SocketController()
export class UserController {
  @Logger()
  private readonly logger: LoggerInterface

  @InjectRepository(User)
  private readonly users: Repository<User>

  private readonly storage: Storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILENAME,
  })

  private readonly bucket = this.storage.bucket('lightning-jackpot.appspot.com')

  @OnMessage('name')
  async name(@ConnectedSocket() socket, @MessageBody() name: string) {
    this.logger.info('name', name)

    socket.user.name = name

    await validate(socket.user)

    await this.users.save({
      ...socket.user,
      name,
    })

    socket.emit('userUpdated', socket.user)
  }

  @OnMessage('avatar')
  async avatar(@ConnectedSocket() socket, @MessageBody() avatar: string) {
    try {
      this.logger.info('avatar')

      const name = `${socket.user.uuid}.jpg`

      const file = this.bucket.file(name)

      await file.save(
        Buffer.from(avatar.replace('data:image/jpeg;base64,', ''), 'base64'),
        {
          metadata: {
            contentType: 'image/jpeg',
            cacheControl: 'public, no-cache',
          },
          public: true,
        }
      )

      socket.user.avatar = `https://storage.googleapis.com/${this.bucket.name}/${name}`

      await validate(socket.user)

      await this.users.save(socket.user)

      socket.emit('userUpdated', socket.user)
    } catch (e) {
      this.logger.error(e)
    }
  }

  @OnMessage('color')
  async color(@ConnectedSocket() socket, @MessageBody() color: string) {
    try {
      this.logger.info('color')

      socket.user.color = color

      await validate(socket.user)

      await this.users.save(socket.user)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
