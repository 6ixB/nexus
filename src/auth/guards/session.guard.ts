import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import routes from 'src/client/client.routes';
import { parse } from 'url';

interface IRequest extends Request {
  session: any;
}

@Injectable()
export class SessionGuard implements CanActivate {
  private readonly logger = new Logger(SessionGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: IRequest = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const session = req.session;
    const user = session.user;

    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    const authRoutes = routes.auth.map((route) => `/client${route}`);
    const protectedRoutes = routes.protected.map((route) => `/client${route}`);

    this.logger.log(`Checking if user is allowed to access ${pathname}`);

    if (!user && protectedRoutes.includes(pathname)) {
      this.logger.log('User is not authenticated');
      res.redirect('/auth/signin');
      return false;
    }

    if (user && authRoutes.includes(pathname)) {
      res.redirect('/client');
      return false;
    }

    return true;
  }
}
