import Faker from 'faker';
import { define } from 'typeorm-seeding';
import uuid from 'uuid';
import { User, UserMeta } from '../users';
import { Role } from '../roles';
import { Tag } from '../tags';
/* tslint:disable */
define(User, (
  faker: typeof Faker,
  settings: any,
) => {
  console.log('user factory start');
  const user = new User();
  const email = faker.internet.email();
  const name = faker.internet.userName();
  user.id = settings && settings.id ? settings.id : undefined;
  user.uuid = uuid.v4();
  user.name = settings && settings.name ? settings.name : name;
  user.email = settings && settings.email ? settings.email : email;
  user.balance = settings && settings.balance ? settings.balance : undefined;
  user.tag = settings && settings.tag ? settings.tag : undefined;
  user.roles = settings && settings.roles ? settings.roles : [];
  user.meta = settings && settings.meta ? settings.meta : [];
  if (process.env.NODE_ENV !== 'production') {
    user.createdAt = faker.date.recent(14);
  }
  console.log('user', user);
  return user;
});
