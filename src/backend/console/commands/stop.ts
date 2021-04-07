import Redis from "ioredis";
import socketIoEmitter from "socket.io-emitter";
import { ioRedisConfig } from "../../config";
export async function stop({ input, flags }) {
  const emitter = socketIoEmitter(new Redis(ioRedisConfig));
  emitter.emit("roulette:stop");
  process.exit(0);
}
