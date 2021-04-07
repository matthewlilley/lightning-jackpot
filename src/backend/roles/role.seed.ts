import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from './role.entity';

export class CreateRoles implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    console.log('Creating Roles');
    try {
      await connection.getRepository(Role).findOneOrFail(1);
    } catch {
      await factory(Role)({
        name: 'admin',
      }).seed();
      await factory(Role)({
        name: 'moderator',
      }).seed();
      await factory(Role)({
        name: 'user',
      }).seed();
    }
  }
}
