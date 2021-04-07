import Redis from 'ioredis'
import { ioRedisConfig } from './config'
import { promisify } from 'util'
import redisLock from 'redis-lock'

export default promisify(redisLock(new Redis(ioRedisConfig)))
