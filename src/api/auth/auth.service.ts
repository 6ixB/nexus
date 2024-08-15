import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { BaseClient } from 'openid-client';
import { Issuer } from 'openid-client';
import type { AuthSignInDto } from './dto/auth-signin.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/api/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { OidcService } from '../oidc/oidc.service';
import type { InteractionResults } from 'oidc-provider';
import type { AuthInteractionDto } from './dto/auth-interaction.dto';
import assert from 'assert';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private issuer: Issuer<BaseClient> | undefined;
  private client: BaseClient | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly oidcService: OidcService,
  ) {}

  public async initialize() {
    const issuer = await Issuer.discover(
      this.configService.get<string>('OIDC_CLIENT_ISSUER'),
    );
    const client = new issuer.Client({
      client_id: this.configService.get<string>('OIDC_CLIENT_ID'),
      client_secret: this.configService.get<string>('OIDC_CLIENT_SECRET'),
      redirect_uris: [
        this.configService.get<string>('OIDC_CLIENT_REDIRECT_URI'),
      ],
      response_types: ['code'],
      post_logout_redirect_uris: [
        this.configService.get<string>('OIDC_CLIENT_POST_LOGOUT_REDIRECT_URI'),
      ],
    });

    this.setIssuer(issuer);
    this.setClient(client);
  }

  public setIssuer(issuer: Issuer<BaseClient> | undefined) {
    this.issuer = issuer;
  }

  public setClient(client: BaseClient | undefined) {
    this.client = client;
  }

  public getIssuer(): Issuer<BaseClient> | undefined {
    return this.issuer;
  }

  public getClient(): BaseClient | undefined {
    return this.client;
  }

  public async authenticate(authSignInDto: AuthSignInDto): Promise<UserEntity> {
    const { email, password } = authSignInDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new UserEntity(user);
  }

  public async getInteractionDetails(req: Request, res: Response) {
    const oidcProvider = this.oidcService.getProvider();
    const interactionDetails = await oidcProvider.interactionDetails(req, res);

    return interactionDetails;
  }

  public async signInInteraction(
    req: Request,
    res: Response,
    authInteractionDto: AuthInteractionDto,
  ) {
    const oidcProvider = this.oidcService.getProvider();

    const user = await this.prismaService.user.findUnique({
      where: { email: authInteractionDto.login.accountId },
    });

    const redirectTo = await oidcProvider.interactionResult(
      req,
      res,
      {
        ...authInteractionDto,
        extras: {
          name: `${user?.firstName} ${user?.lastName}`,
        },
      } as unknown as InteractionResults,
      { mergeWithLastSubmission: false },
    );

    // Artificial delay
    // TODO: Remove this in production
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return redirectTo;
  }

  public async confirmInteraction(req: Request, res: Response) {
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

    const consent: { [key: string]: unknown } = {};
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = { consent };

    const redirectTo = await oidcProvider.interactionResult(
      req,
      res,
      result as InteractionResults,
      { mergeWithLastSubmission: true },
    );

    // Artificial delay
    // TODO: Remove this in production
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return redirectTo;
  }

  public async abortInteraction(req: Request, res: Response) {
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

    // Artificial delay
    // TODO: Remove this in production
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return redirectTo;
  }
}
