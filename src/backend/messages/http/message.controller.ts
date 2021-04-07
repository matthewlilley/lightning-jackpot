import { KeyType, Redis } from 'ioredis';
import { Get, JsonController, NotFoundError, Param } from 'routing-controllers';
import { Container } from 'typedi';
import { MessageRepository } from '..'
import  { RedisClient } from '../../redis';

@JsonController()
export class MessageController {
  private readonly messages: MessageRepository = Container.get(MessageRepository);

  @RedisClient()
  redis: Redis;

  @Get('/api/v0/messages')
  async index() {
    return this.messages.all()
  }

  @Get('/api/v0/messages/:room')
  async get(@Param('room') room: string) {
    console.log('get message for ROOM:', room);
    if (!['roulette'].includes(room)) {
      throw new NotFoundError();
    }

    const keys: KeyType[] = [room, 'online'];

    const [messages, online] = await this.redis.mget(...keys);

    return {
      messages: messages ? JSON.parse(messages) : [],
      // online: parseInt(online, 10),
    };
  }
}
