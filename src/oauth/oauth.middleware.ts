import {
  ForbiddenException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OauthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OauthMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Prevent requests with the query parameter '_rsc'
    // _rsc requests are problematic because it can
    // trigger the OIDC controller to perform unwanted request handlings

    const forbiddenParam = '_rsc';

    if (req.query[forbiddenParam]) {
      this.logger.error(
        `Requests with the query parameter '${forbiddenParam}' are not allowed.`,
      );

      throw new ForbiddenException(
        `Requests with the query parameter '${forbiddenParam}' are not allowed.`,
      );
    }

    next();
  }
}
