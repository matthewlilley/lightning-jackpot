import { SocketControllersOptions } from 'socket-controllers';

export const socketControllersConfig: SocketControllersOptions = {
  controllers: [
    process.cwd() + '/' + process.env.WS_CONTROLLERS
  ],
  middlewares: [
    process.cwd() + '/' + process.env.WS_MIDDLEWARE
  ],
};
