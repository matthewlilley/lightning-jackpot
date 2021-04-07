import RedisStatic, { Redis } from 'ioredis';
import { Container } from 'typedi';
import { ioRedisConfig } from '../config';

export function RedisClient() {
  const redisClient: Redis = new RedisStatic(ioRedisConfig);
  return (object: object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => redisClient
    });
  };
}
