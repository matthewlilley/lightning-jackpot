import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Tag } from './tag.entity';

define(Tag, (faker: typeof Faker, settings: any) => {
  const tag = new Tag();
  tag.color = settings.color;
  tag.text = settings.text;
  return tag;
});
