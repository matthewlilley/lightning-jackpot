import { Validator as ClassValidator } from "class-validator";
import { Container } from "typedi";

export function Validator() {
  return (object: object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => Container.get(ClassValidator)
    });
  };
}
