import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Role } from './role.entity';

define(Role, (faker: typeof Faker, settings: any) => {
  const role = new Role();
  role.name = settings.name;
  return role;
});
