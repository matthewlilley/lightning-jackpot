import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

import { User } from '../users'
import { getRepository } from 'typeorm'

@ValidatorConstraint({ async: true })
export class NameExistsConstraint implements ValidatorConstraintInterface {
  async validate(name: string): Promise<boolean> {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ name })
    if (user) {
      return false
    }
    return true
  }
}

export function NameExists(
  validationOptions?: ValidationOptions
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NameExistsConstraint,
    })
  }
}
