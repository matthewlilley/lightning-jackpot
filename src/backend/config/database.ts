import { ConnectionOptions, getConnectionOptions } from 'typeorm'

import { ioRedisConfig } from './ioredis'

export async function getDatabaseConfig(): Promise<ConnectionOptions | any> {
  const connectionOptions = await getConnectionOptions()
  return {
    ...connectionOptions,
    // https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#mysql--mariadb-connection-options
    // charset:
    // timezone:
    // connectTimeout:
    // acquireTimeout:
    // bigNumberStrings:
    // dateStrings:
    // debug:
    // trace:
    logging: false,
    debug: false,
    extra: {
      charset: 'utf8mb4',
    },
    cache: {
      type: 'ioredis',
      options: ioRedisConfig,
    },
    replication: {
      master: {
        host: String(process.env.MYSQL_MASTER_HOST),
        port: Number(process.env.MYSQL_MASTER_PORT_NUMBER),
        username: String(process.env.MYSQL_USER),
        password: String(process.env.MYSQL_PASSWORD),
        database: String(process.env.MYSQL_DATABASE),
      },
      slaves: [
        {
          host: String(process.env.MYSQL_SLAVE_HOST),
          port: Number(process.env.MYSQL_SLAVE_PORT_NUMBER),
          username: String(process.env.MYSQL_USER),
          password: String(process.env.MYSQL_PASSWORD),
          database: String(process.env.MYSQL_DATABASE),
        },
      ],

      /**
       * If true, PoolCluster will attempt to reconnect when connection fails. (Default: true)
       */
      canRetry: true,

      /**
       * If connection fails, node's errorCount increases.
       * When errorCount is greater than removeNodeErrorCount, remove a node in the PoolCluster. (Default: 5)
       */
      removeNodeErrorCount: 10,

      /**
       * If connection fails, specifies the number of milliseconds before another connection attempt will be made.
       * If set to 0, then node will be removed instead and never re-used. (Default: 0)
       */
      restoreNodeTimeout: 5000,

      /**
       * Determines how slaves are selected:
       * RR: Select one alternately (Round-Robin).
       * RANDOM: Select the node by random function.
       * ORDER: Select the first node available unconditionally.
       */
      selector: 'RR',
    },
  }
}
