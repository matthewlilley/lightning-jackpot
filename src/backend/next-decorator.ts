import { Container } from 'typedi'
import next from 'next'
import { nextServerConfig } from './config'

const app = next(nextServerConfig)

export function Next() {
  return (object: object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => app,
    })
  }
}

export function NextRequestHandler() {
  const handle = app.getRequestHandler()
  return (object: object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: containerInstance => handle,
    })
  }
}
