import { Logger } from 'log4js';

export interface GameInterface {
  readonly logger: Logger;
  readonly name: string;
  start(): void;
  stop(): void;
  restart(): void;
  initialise(): Promise<void>;
}
