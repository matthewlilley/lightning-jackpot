import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

export class Developer implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): any {
    const developers = String(process.env.DEVELOPERS).split(',');
    if (!res.locals.user || !developers.includes(res.locals.user.email)) {
      // Usually as 401, but we'll send a 404 instead since
      // we don't want the protected routes to be detectable.
      return res.sendStatus(404);
    }
    return next();
  }
}

export default Developer;
