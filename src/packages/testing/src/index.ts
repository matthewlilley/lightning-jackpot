import { ConnectionOptions, getConnectionOptions } from 'typeorm'

import debug from 'debug'

const log = debug('lightning-jackpot:testing')

export async function getDatabaseConfig(): Promise<ConnectionOptions> {
  const connectionOptions = await getConnectionOptions()
  log('default testing connection options', connectionOptions)
  return {
    ...connectionOptions,
    entities: ['src/backend/**/*.entity.ts'],
    subscribers: ['src/backend/**/*.subscriber.ts'],
    migrations: ['src/backend/**/*.migration.ts'],
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    database: 'lightning-jackpot-test',
    username: 'user',
    password: 'secret',
    synchronize: true,
    dropSchema: true,
    debug: false,
    extra: {
      charset: 'utf8mb4',
    },
  }
}
