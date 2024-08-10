import type { NestMiddleware } from '@nestjs/common';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class OidcMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OidcMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Prevent requests with the query parameter '_rsc' from the Next.js app
    // _rsc requests are problematic because it can
    // trigger the OIDC controller to handle unwanted requests

    const forbiddenParam = '_rsc';

    if (req.query[forbiddenParam]) {
      this.logger.error(
        `Requests with the query parameter '${forbiddenParam}' are not allowed and therefore are ignored.`,
      );

      throw new ForbiddenException(
        `Requests with the query parameter '${forbiddenParam}' are not allowed and therefore are ignored.`,
      );
    }

    next();
  }
}
