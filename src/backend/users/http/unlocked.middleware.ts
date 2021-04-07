import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { parse } from 'url';

@Middleware({ type: 'before' })
export class Unlocked implements ExpressMiddlewareInterface {
  async use(req: Request | any, res: Response, next: NextFunction) {
    if (res.locals.user) {
      const parsedUrl = parse(req.url, true);
      const { locked } = res.locals.user;
      delete res.locals.user.locked;
      if (locked) {
        if (parsedUrl.path) {
          if (parsedUrl.path.includes('/api')) {
            return res.sendStatus(401);
          }
          if (parsedUrl.path === '/locked' || parsedUrl.path.includes('static') || parsedUrl.path.includes('_next')) {
            return next();
          }
        }
        return res.redirect(301, '/locked')
      }
    }
    next();
  }
}
