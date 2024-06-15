import { Controller, Logger, Get, Render, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { OidcService } from 'src/oidc/oidc.service';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly oidcService: OidcService,
  ) {}

  @Get('signin/:uid')
  @Render('auth/signin')
  async signin(@Req() req: Request, @Res() res: Response) {
    const oidcProvider = this.oidcService.getProvider();
    const interactionDetails = await oidcProvider.interactionDetails(req, res);
    return { message: JSON.stringify(interactionDetails) };
  }
}
