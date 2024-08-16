import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const controller = context.getClass();

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    this.logger.debug(
      `${controller.name}.${handler.name}: Handling request ${req.method} ${req.url}`,
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.debug(
            `${controller.name}.${handler.name}: Completed in ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
