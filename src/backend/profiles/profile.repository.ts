import { EntityRepository, Repository } from 'typeorm'
import { Profile } from '.'

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  //
}
