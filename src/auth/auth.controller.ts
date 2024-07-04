import {
  Controller,
  Logger,
  Get,
  Req,
  Res,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OidcService } from 'src/oidc/oidc.service';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { AuthInteractionDto } from './dto/auth-interaction.dto';
import { InteractionResults } from 'oidc-provider';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly oidcService: OidcService,
  ) {}

  @Get('interactions/:uid')
  async getInteractionDetails(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`getInteractionDetails for ${req.params.uid}`);

    const oidcProvider = this.oidcService.getProvider();
    const interactionDetails = await oidcProvider.interactionDetails(req, res);

    res.status(HttpStatus.OK).send(interactionDetails);
  }

  @Post('interactions/:uid/finish')
  @ApiResponse({
    status: HttpStatus.SEE_OTHER,
    description: 'The interaction has been successfully finished.',
  })
  @ApiBody({ type: AuthInteractionDto })
  async finishInteraction(
    @Req() req: Request,
    @Res() res: Response,
    @Body() authInteractionDto: AuthInteractionDto,
  ) {
    this.logger.log(`finishInteraction for ${req.params.uid}`);
    this.logger.log(authInteractionDto);

    const oidcProvider = this.oidcService.getProvider();
    return await oidcProvider.interactionFinished(
      req,
      res,
      authInteractionDto as InteractionResults,
    );
  }
}
