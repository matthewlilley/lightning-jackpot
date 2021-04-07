import { Redis } from 'ioredis';
import { Service } from 'typedi';
import { Logger, LoggerInterface } from '../logger';
import { RedisClient } from '../redis';

@Service()
export class MessageRepository {
  @RedisClient()
  private readonly redis: Redis;
  @Logger()
  private readonly logger: LoggerInterface;
  async create(message) {
    this.logger.info('MessageRepository create', message);
    const response = await this.redis.get('global');
    const messages = response ? JSON.parse(response) : [];
    messages.push(message);
    await this.redis.set(
      'global',
      JSON.stringify(
        messages.length > 25 ? messages.slice(1).slice(-25) : messages,
      ),
    );
    return message;
  }
  async all() {
    const keys = ['global', 'online'];
    const [messages, online] = await this.redis.mget(...keys);
    return {
      messages: messages ? JSON.parse(messages) : [],
      // online: parseInt(online, 10),
    };
  }
}
