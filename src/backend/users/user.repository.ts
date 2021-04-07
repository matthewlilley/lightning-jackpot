import { EntityRepository, Repository } from 'typeorm'

import { User } from './user.entity'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findById(id: number) {
    return this.findOneOrFail({
      where: { id },
      relations: ['balance', 'roles'],
    })
  }
  findByEmail(email: string) {
    return this.findOne({
      where: { email },
      relations: ['balance', 'roles'],
    })
  }
  // create(user) {
  //   return this.save(this.create(user))
  // }
}
