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
import { OauthService } from 'src/oauth/oauth.service';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { AuthInteractionDto } from './dto/auth-interaction.dto';
import { InteractionResults } from 'oidc-provider';
import assert from 'assert';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly oidcService: OauthService,
  ) {}

  @Get('interactions/:uid')
  async getInteractionDetails(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`getInteractionDetails for ${req.params.uid}`);

    const oidcProvider = this.oidcService.getProvider();
    const interactionDetails = await oidcProvider.interactionDetails(req, res);

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
    this.logger.log(`finishInteraction for ${req.params.uid}`);
    this.logger.log('interceptedCookies: ', req.cookies);
    this.logger.log('interactionResult: ', authInteractionDto);

    const oidcProvider = this.oidcService.getProvider();

    const redirectTo = await oidcProvider.interactionResult(
      req,
      res,
      authInteractionDto as InteractionResults,
      { mergeWithLastSubmission: false },
    );

    this.logger.log('redirectTo: ', redirectTo);

    // Artificial delay to simulate a slow network
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    this.logger.log(`confirmInteraction for ${req.params.uid}`);
    this.logger.log('interceptedCookies: ', req.cookies);

    const oidcProvider = this.oidcService.getProvider();
    const interactionDetails = await oidcProvider.interactionDetails(req, res);

    const {
      prompt: { name, details },
      params,
      session: { accountId },
    } = interactionDetails;

    assert.equal(name, 'consent');

    let { grantId } = interactionDetails;
    let grant;

    if (grantId) {
      grant = await oidcProvider.Grant.find(grantId);
    } else {
      grant = new oidcProvider.Grant({
        accountId,
        clientId: params.client_id as string,
      });
    }

    if (details.missingOIDCScope) {
      grant.addOIDCScope((details.missingOIDCScope as string[]).join(' '));
    }

    if (details.missingOIDCClaims) {
      grant.addOIDCClaims(details.missingOIDCClaims);
    }

    if (details.missingResourceScopes) {
      for (const [indicator, scopes] of Object.entries(
        details.missingResourceScopes,
      )) {
        grant.addResourceScope(indicator, scopes.join(' '));
      }
    }

    grantId = await grant.save();

    this.logger.log('grant: ', JSON.stringify(grant, null, 2));

    const consent: { [key: string]: unknown } = {};
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = { consent };

    this.logger.log('interactionResult: ', result);

    const redirectTo = await oidcProvider.interactionResult(
      req,
      res,
      result as InteractionResults,
      { mergeWithLastSubmission: true },
    );

    this.logger.log('redirectTo: ', redirectTo);

    // Artificial delay to simulate a slow network
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    this.logger.log(`abortInteraction for ${req.params.uid}`);
    this.logger.log('interceptedCookies: ', req.cookies);

    const oidcProvider = this.oidcService.getProvider();

    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };

    const redirectTo = await oidcProvider.interactionResult(
      req,
      res,
      result as InteractionResults,
      { mergeWithLastSubmission: false },
    );

    this.logger.log('redirectTo: ', redirectTo);

    // Artificial delay to simulate a slow network
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res
      .set('Cache-Control', 'no-store')
      .status(HttpStatus.CREATED)
      .send({ redirectTo });
  }
}
