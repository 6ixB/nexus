import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter<NotFoundException>
  implements ExceptionFilter
{
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    response.redirect('/not-found');
  }
}
