import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { ApiRoute } from 'src/api/api.routes';
import clientRoutes from 'src/client/client.routes';
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

    const authRoutes = clientRoutes.auth.map((route) => `${route}`);
    const protectedRoutes = clientRoutes.protected.map((route) => `${route}`);

    if (!user && protectedRoutes.includes(pathname)) {
      res.redirect(`/${ApiRoute.AUTH}/signin`);
      return false;
    }

    if (user && authRoutes.includes(pathname)) {
      res.redirect('/');
      return false;
    }

    return true;
  }
}
