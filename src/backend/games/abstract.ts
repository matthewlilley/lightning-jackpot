import { EventEmitter } from 'events';

export abstract class Abstract extends EventEmitter {
  abstract start(): void;
  abstract stop(): void;
  abstract restart(): void;
}

export default Abstract;
