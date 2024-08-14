import type { ExecutionContext } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import base64url from 'base64url';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { ClientRoute } from 'src/client/client.routes';

@Injectable()
export class OidcGuard extends AuthGuard('oidc') {
  private readonly logger = new Logger(OidcGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const error = req.query['error'];
    const errorDescription = req.query['error_description'];

    if (error && errorDescription) {
      const errorPayload = {
        error: error,
        error_description: errorDescription,
      };

      res.redirect(
        `${ClientRoute.AUTH_ERROR.replace('/:error', '')}/${base64url.encode(JSON.stringify(errorPayload))}`,
      );

      return false;
    }

    const result = super.canActivate(context);

    return result;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    return super.handleRequest(err, user, info, context, status);
  }
}
