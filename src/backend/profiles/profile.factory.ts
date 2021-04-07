import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Profile } from '.';

define(Profile, (faker: typeof Faker, settings: { providerId: string, provider: string, userId: number } | undefined) => {
  const profile = new Profile();
  if (settings && settings.providerId && settings.provider && settings.userId) {
    profile.providerId = settings.providerId;
    profile.provider = settings.provider;
    profile.userId = settings.userId;
  }
  return profile;
});
