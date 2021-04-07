import { Action, RoutingControllersOptions } from 'routing-controllers'

import { Role } from '../roles'
import { User } from '../users'
import { getManager } from 'typeorm'
import logger from '../logger'

export const routingControllersConfig: RoutingControllersOptions = {
  cors: false,
  // controllers: [
  //   process.cwd() + '/src/server/**/http/**/*.controller.{ts,js}',
  //   process.cwd() + '/src/server/wildcard.controller.{ts,js}',
  // ],
  // middlewares: [process.cwd() + '/src/server/**/http/**/*.middleware.{ts,js}'],
  // interceptors: [
  //   process.cwd() + '/src/server/**/http/**/*.interceptor.{ts,js}',
  // ],
  controllers: [
    process.cwd() + '/' + process.env.HTTP_CONTROLLERS,
    // process.cwd() + '/dist/wildcard.controller.{ts,js}',
    // process.cwd() + '/src/server/wildcard.controller.{ts,js}',
  ],
  middlewares: [process.cwd() + '/' + process.env.HTTP_MIDDLEWARE],
  // interceptors: [process.cwd() + '/' + process.env.HTTP_INTERCEPTORS],
  classTransformer: true,
  validation: true,
  development: process.env.NODE_ENV !== 'production',
  defaultErrorHandler: true,

  authorizationChecker: async (action: Action, roles: Role[]) => {
    if (action.request.user && !roles.length) {
      logger.debug('user but no role needed, authorize')
      return true
    }

    if (
      action.request.user &&
      roles.find(
        (role: Role) =>
          action.request.user.roles.map(({ name }) => name).indexOf(role) !== -1
      )
    ) {
      logger.debug('user with needed role, authorize')
      return true
    }

    return false

    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    // demo code:
    // const token = action.request.headers.authorization

    // const user = await getManager().findOne(User, { where: { token } })

    // if (user && !roles.length) {
    //   return true
    // }
    // if (user && roles.find((role: Role) => user.roles.indexOf(role) !== -1)) {
    //   return true
    // }
    // return false
  },

  currentUserChecker: async (action: Action) => {
    logger.info('currentUserChecker', action)
    // here you can use request/response objects from action
    // you need to provide a user object that will be injected in controller actions
    // demo code:
    const token = action.request.headers.authorization
    return getManager().findOne(User, { where: { token } })
  },
}
