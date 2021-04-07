import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

import { User } from '../users'
import { getRepository } from 'typeorm'

@ValidatorConstraint({ async: true })
export class EmailExistsConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ email })
    if (user) {
      return false
    }
    return true
  }
}

export function EmailExists(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailExistsConstraint,
    })
  }
}
