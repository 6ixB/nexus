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
import { ApiExcludeController } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { SessionGuard } from '../api/auth/guards/session.guard';
import express from 'express';
import { parse } from 'url';
import clientRoutes, { ClientRoute } from './client.routes';
import { ApiRoute } from 'src/api/api.routes';

@Controller()
@ApiExcludeController()
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
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Get([...clientRoutes.public, ...clientRoutes.nextStatic])
  async handleNextStatic(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    await this.handleClient(req, res);
  }

  @Get([...clientRoutes.auth])
  @UseGuards(SessionGuard)
  async handleAuth(@Req() req: express.Request, @Res() res: express.Response) {
    if (req.url === ClientRoute.AUTH_SIGNIN) {
      return res.redirect(`/${ApiRoute.AUTH}/signin`);
    }

    await this.handleClient(req, res);
  }

  @Get([...clientRoutes.protected])
  @UseGuards(SessionGuard)
  async handleProtected(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Session() session: Record<string, any>,
  ) {
    await this.handleClient(req, res, session);
  }
}
