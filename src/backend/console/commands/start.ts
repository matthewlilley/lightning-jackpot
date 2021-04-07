import Redis from "ioredis";
import socketIoEmitter from "socket.io-emitter";
import { ioRedisConfig } from "../../config";
export async function start({ input, flags }) {
  const emitter = socketIoEmitter(new Redis(ioRedisConfig));
  emitter.emit("roulette:start");
  process.exit(0);
}
