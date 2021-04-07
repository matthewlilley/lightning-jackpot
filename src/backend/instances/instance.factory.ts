import Faker from 'faker';
import moment from 'moment';
import { define } from 'typeorm-seeding';
import { Instance } from './instance.entity';

define(Instance, (faker: typeof Faker, settings: any) => {
  const instance = new Instance();
  instance.game = settings.game;
  instance.value = 1337;
  instance.state = {
    startedAt: moment().unix() + 12,
  };
  return instance;
});
