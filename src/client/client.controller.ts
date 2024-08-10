import {
  Controller,
  Logger,
  Req,
  Res,
  Get,
  HttpStatus,
  UseGuards,
  Session,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { SessionGuard } from '../auth/guards/session.guard';
import express from 'express';
import { parse } from 'url';
import routes, { ClientRoutes } from './client.routes';

@Controller('client')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);

  constructor(private readonly clientService: ClientService) {}

  async handleClient(
    @Req() req: express.Request,
    @Res() res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    session: Record<string, any> | undefined = undefined,
  ) {
    try {
      const nextApp = this.clientService.getNextApp();
      const nextAppRequestHandler = nextApp.getRequestHandler();

      const parsedUrl = parse(req.url, true);

      await nextAppRequestHandler(req, res, parsedUrl);
    } catch (error) {
      this.logger.error(`Error rendering Next.js page: ${error.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Get([...routes.nextStatic])
  async handleNextStatic(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    this.logger.log(`Handling client static assets request to ${req.url}`);
    await this.handleClient(req, res);
  }

  @Get([...routes.auth])
  @UseGuards(SessionGuard)
  async handleAuth(@Req() req: express.Request, @Res() res: express.Response) {
    this.logger.log(`Handling client auth request to ${req.url}`);

    if (req.url === `/client${ClientRoutes.AUTH_SIGNIN}`) {
      return res.redirect('/auth/signin');
    }

    await this.handleClient(req, res);
  }

  @Get([...routes.protected])
  @UseGuards(SessionGuard)
  async handleProtected(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Session() session: Record<string, any>,
  ) {
    this.logger.log(`Handling client protected request to ${req.url}`);
    this.logger.log('Current session:', JSON.stringify(session));
    await this.handleClient(req, res, session);
  }
}
