import {
  Controller,
  Logger,
  Req,
  Res,
  Get,
  All,
  Redirect,
  HttpStatus,
} from '@nestjs/common';
import express from 'express';
import { ClientService } from './client.service';
import { parse } from 'url';

@Controller('client')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);

  constructor(private clientService: ClientService) {}

  @Get()
  @Redirect('/client/auth/signin', HttpStatus.MOVED_PERMANENTLY)
  root() {}

  @All('*')
  async handleClient(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    this.logger.log('Handling client request');

    const nextApp = this.clientService.getNextApp();
    const nextAppRequestHandler = nextApp.getRequestHandler();

    const parsedUrl = parse(req.url, true);

    try {
      if (req.url.startsWith('/client/_next')) {
        this.logger.log('Serving static Next.js asset');
        return nextAppRequestHandler(req, res, parsedUrl);
      }

      await nextApp.render(req, res, parsedUrl.pathname, parsedUrl.query);
    } catch (error) {
      this.logger.error(`Error rendering Next.js page: ${error.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
