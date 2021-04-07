// Logger.ts
import { getLogger } from "log4js";
import { Container } from "typedi";

export function Logger() {
  return (object: object, propertyName: string, index?: number) => {
    const logger = getLogger();
    logger.level = String(process.env.LOG_LEVEL);
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => logger
    });
  };
}
