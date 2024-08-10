import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AccountClaims, Configuration } from 'oidc-provider';
import OidcPrismaAdapter from './adapters/prisma.oidc-adapter';
import { PrismaService } from 'nestjs-prisma';
import type {
  OidcAdapter,
  OidcClients,
  OidcCookies,
  OidcFindAccount,
  OidcRenderError,
  OidcScopes,
  OidcClaims,
} from './oidc.config.types';
import base64url from 'base64url';
import { ClientRoute } from 'src/client/client.routes';

@Injectable()
export class OidcConfig {
  private readonly logger = new Logger(OidcConfig.name);

  private clients: OidcClients;
  private adapter: OidcAdapter;
  private findAccount: OidcFindAccount;
  private interactions;
  private features;
  private cookies: OidcCookies;
  private renderError: OidcRenderError;
  private scopes: OidcScopes;
  private claims: OidcClaims;
  private readonly oidcConfig: Configuration;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.clients = [
      {
        client_id: this.configService.get<string>('OIDC_CLIENT_ID'),
        client_secret: this.configService.get<string>('OIDC_CLIENT_SECRET'),
        redirect_uris: [
          this.configService.get<string>('OIDC_CLIENT_REDIRECT_URI'),
        ],
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
      },
    ];

    this.scopes = ['openid', 'profile', 'email', 'offline_access'];

    this.claims = {
      openid: ['sub'],
      email: ['email', 'email_verified'],
      profile: [
        'name',
        'family_name',
        'given_name',
        'middle_name',
        'nickname',
        'preferred_username',
        'profile',
        'picture',
        'website',
        'gender',
        'birthdate',
        'zoneinfo',
        'locale',
        'updated_at',
      ],
      address: ['address'],
      phone: ['phone_number', 'phone_number_verified'],
    };

    this.adapter = OidcPrismaAdapter;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.findAccount = async (ctx, sub, token) => {
      this.logger.log('Finding account for sub:', sub);

      const user = await this.prismaService.user.findUnique({
        where: { email: sub },
      });

      if (!user) {
        this.logger.error('User not found for sub:', sub);
        return;
      }

      this.logger.log('Found user:', user);

      return {
        accountId: sub,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async claims(use, scope, claims, rejected) {
          console.log('Claims function called with:');
          console.log(`Use: ${use}`);
          console.log(`Scope: ${scope}`);
          console.log(`Claims: ${JSON.stringify(claims)}`);
          console.log(`Rejected: ${JSON.stringify(rejected)}`);

          const allClaims = {
            email: user.email,
            email_verified: false,
            name: `${user.firstName} ${user.lastName}`,
            given_name: user.firstName,
            family_name: user.lastName,
          };

          let scopeClaims: AccountClaims = { sub: user.id };

          if (scope.includes('profile')) {
            scopeClaims = {
              ...scopeClaims,
              name: allClaims.name,
              given_name: allClaims.given_name,
              family_name: allClaims.family_name,
            };
          }

          if (scope.includes('email')) {
            scopeClaims = {
              ...scopeClaims,
              email: allClaims.email,
              email_verified: allClaims.email_verified,
            };
          }

          console.log('Returning claims:', scopeClaims);

          return scopeClaims;
        },
      };
    };

    this.interactions = {
      url: async (ctx, interaction) => {
        this.logger.log(
          'Generating interactions URL for interaction UID:',
          interaction.uid,
        );

        const url = `http://localhost:3000/auth/signin?interactionUid=${interaction.uid}`;
        this.logger.log('Generated URL:', url);

        return url;
      },
    };

    this.features = {
      devInteractions: { enabled: false },
    };

    this.cookies = {
      long: {
        path: '/',
      },
      short: {
        path: '/',
      },
      keys: ['some-secret-key', 'another-secret-key'],
    };

    this.renderError = async (ctx, out, error) => {
      ctx.res.statusCode = 302;
      ctx.res.setHeader(
        'Location',
        `${ClientRoute.AUTH_ERROR}?error=${base64url.encode(JSON.stringify(error))}`,
      );
      ctx.res.end();
    };

    this.oidcConfig = {
      clients: this.clients,
      scopes: this.scopes,
      adapter: this.adapter,
      findAccount: this.findAccount,
      interactions: this.interactions,
      features: this.features,
      cookies: this.cookies,
      renderError: this.renderError,
      claims: this.claims,
    };
  }

  public getOidcConfig(): Configuration {
    return this.oidcConfig;
  }
}
