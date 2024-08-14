import {
  Controller,
  Logger,
  Get,
  Req,
  Res,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  HttpCode,
  UnauthorizedException,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthInteractionDto } from './dto/auth-interaction.dto';
import { OidcGuard } from './guards/oidc.guard';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { ApiRoute } from '../api.routes';

@Controller(ApiRoute.AUTH)
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('signin')
  @UseGuards(OidcGuard)
  async signInOidc() {
    return;
  }

  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async signIn(@Body() authSignInDto: AuthSignInDto) {
    return await this.authService.authenticate(authSignInDto);
  }

  @Get('interactions/:uid')
  async getInteractionDetails(@Req() req: Request, @Res() res: Response) {
    const interactionDetails = await this.authService.getInteractionDetails(
      req,
      res,
    );

    res
      .set('Cache-Control', 'no-store')
      .status(HttpStatus.OK)
      .send(interactionDetails);
  }

  @Post('interactions/:uid/signin')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBody({ type: AuthInteractionDto })
  async signInInteraction(
    @Req() req: Request,
    @Res() res: Response,
    @Body() authInteractionDto: AuthInteractionDto,
  ) {
    const redirectTo = await this.authService.signInInteraction(
      req,
      res,
      authInteractionDto,
    );

    res
      .set('Cache-Control', 'no-store')
      .status(HttpStatus.CREATED)
      .send({ redirectTo });
  }

  @Post('interactions/:uid/confirm')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  async confirmInteraction(@Req() req: Request, @Res() res: Response) {
    const redirectTo = await this.authService.confirmInteraction(req, res);

    res
      .set('Cache-Control', 'no-store')
      .status(HttpStatus.CREATED)
      .send({ redirectTo });
  }

  @Post('interactions/:uid/abort')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBody({ type: AuthInteractionDto })
  async abortInteraction(@Req() req: Request, @Res() res: Response) {
    const redirectTo = await this.authService.abortInteraction(req, res);

    res
      .set('Cache-Control', 'no-store')
      .status(HttpStatus.CREATED)
      .send({ redirectTo });
  }

  @Get('callback')
  @ApiResponse({
    status: HttpStatus.FOUND,
  })
  @UseGuards(OidcGuard)
  async callback(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session,
  ) {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedException();
    }

    const user = req.user;
    session.user = user;

    res.redirect('/');
  }

  @Get('session/me')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getSession(@Session() session, @Res() res: Response) {
    const user = session.user ?? {};

    res
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-store')
      .status(HttpStatus.OK)
      .send(user);
  }

  @Post('signout')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async signOut(@Req() req: Request, @Res() res: Response) {
    req.logOut(async (err) => {
      if (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Internal Server Error');
      }

      req.session.destroy(async (err) => {
        if (err) {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send('Internal Server Error');
        }

        // Artificial delay
        // TODO: Remove this in production
        await new Promise((resolve) => setTimeout(resolve, 1000));

        res.set('Cache-Control', 'no-store').status(HttpStatus.OK).send('OK');
      });
    });
  }
}
