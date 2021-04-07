const preferredSlaves = [
  // { ip: String(process.env.REDIS_SLAVE_HOST), port: 6380, prio: 1 },
  // { ip: String(process.env.REDIS_SLAVE_HOST), port: 6381, prio: 2 },
  // { ip: String(process.env.REDIS_SLAVE_HOST), port: 6382, prio: 3 },
];

export const ioRedisConfig = {
  name: "mymaster",
  sentinels: [
    {
      host: String(process.env.REDIS_SENTINEL_HOST),
      port: Number(process.env.REDIS_SENTINEL_PORT_NUMBER)
    }
  ],
  password: String(process.env.REDIS_PASSWORD),
  showFriendlyErrorStack: process.env.NODE_ENV !== "production"
  // sentinelRetryStrategy(times) {
  //   const delay = Math.min(times * 10, 1000);
  //   return delay;
  // },
};
