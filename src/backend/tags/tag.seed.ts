import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Tag } from './tag.entity';

export class CreateTags implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    console.log('Creating Tags');
    await factory(Tag)({
      text: 'ADMIN',
      color: '#722ed1',
    }).seed();
    await factory(Tag)({
      text: 'OBSERVER',
      color: '#722ed1',
    }).seed();
    await factory(Tag)({
      text: 'PLAYER',
      color: '#722ed1',
    }).seed();
    await factory(Tag)({
      text: 'DONATOR',
      color: '#722ed1',
    }).seed();
  }
}
