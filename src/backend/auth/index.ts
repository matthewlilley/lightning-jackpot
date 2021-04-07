import { getCustomRepository, getRepository } from 'typeorm'

import { Profile } from '../profiles'
import { UserRepository } from '../users'
import logger from '../logger'

export async function socialHandler(
  token,
  tokenSecret,
  { id, provider },
  done
) {
  try {
    const profile = await getRepository(Profile).findOne({
      relations: ['user'],
      where: { providerId: id, provider },
    })
    if (profile) {
      return done(null, profile.user)
    } else {
      const userRepository = getCustomRepository(UserRepository)
      const profileRepository = getRepository(Profile)
      const user = await userRepository.save(userRepository.create())
      const profile = await profileRepository.save(
        profileRepository.create({
          providerId: id,
          provider,
          user,
        })
      )
      return done(null, user)
    }
  } catch (error) {
    logger.error('Social auth error', error)
    return done(error, null)
  }
}
