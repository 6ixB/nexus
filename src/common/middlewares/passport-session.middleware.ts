import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

@Injectable()
export class PassportSessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    passport.session()(req, res, next);
  }
}
