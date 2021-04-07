import Filter from 'bad-words';
import { Sanitizer } from 'class-sanitizer';
import { Validator } from 'class-validator';
import moment from 'moment';
import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers';
import { Container } from 'typedi';
import { Logger, LoggerInterface } from '../../logger';
import { MessageRepository } from '../message.repository';

@SocketController()
export class MessageController {
  @Logger()
  private readonly logger: LoggerInterface;

  private readonly filter: Filter = Container.get(Filter);

  private readonly validator: Validator = Container.get(Validator);

  private readonly messages: MessageRepository = Container.get(MessageRepository);

  @OnMessage('global')
  async global(@ConnectedSocket() socket: any, @SocketIO() io: any, @MessageBody() value: string) {
    this.logger.debug('MessageController', socket.user)
    const message = {
      id: moment().unix(),
      type: 'user',
      author: socket.user ? socket.user.name : 'Anon',
      color: socket.user ? socket.user.color : '#6b46c1',
      value: this.filter.clean(value)
    };
    this.logger.debug('MessageController message', message)
    await this.messages.create(message)
    this.logger.debug('global message', message)
    io.emit('global', message);
  }
}
