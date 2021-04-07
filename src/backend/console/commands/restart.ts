import Redis from "ioredis";
import socketIoEmitter from "socket.io-emitter";
import { ioRedisConfig } from "../../config";
export async function restart({ input, flags }) {
  const emitter = socketIoEmitter(new Redis(ioRedisConfig));
  emitter.emit("roulette:restart");
  process.exit(0);
}
