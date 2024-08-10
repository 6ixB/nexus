import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

@Injectable()
export class PassportSessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    passport.session()(req, res, next);
  }
}
