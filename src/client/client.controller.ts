import { Controller, Logger, Req, Res, Get, HttpStatus } from '@nestjs/common';
import express from 'express';
import { ClientService } from './client.service';
import { parse } from 'url';

@Controller('client')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);

  constructor(private readonly clientService: ClientService) {}

  @Get()
  root(@Req() req: express.Request, @Res() res: express.Response) {
    return this.handleClient(req, res);
  }

  @Get('*')
  async handleClient(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    this.logger.log(`Handling client request to ${req.url}`);

    const nextApp = this.clientService.getNextApp();
    const nextAppRequestHandler = nextApp.getRequestHandler();

    const parsedUrl = parse(req.url, true);

    try {
      await nextAppRequestHandler(req, res, parsedUrl);
    } catch (error) {
      this.logger.error(`Error rendering Next.js page: ${error.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
