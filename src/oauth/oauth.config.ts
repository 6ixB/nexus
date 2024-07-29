import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'oidc-provider';
import PrismaAdapter from 'src/oauth/adapters/prisma.oauth-adapter';
import {
  OauthAdapter,
  OauthClients,
  OauthCookies,
  OauthFindAccount,
  OauthRenderError,
} from './oauth.config.types';
import base64url from 'base64url';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OauthConfig {
  private readonly logger = new Logger(OauthConfig.name);

  private clients: OauthClients;
  private adapter: OauthAdapter;
  private findAccount: OauthFindAccount;
  private interactions;
  private features;
  private cookies: OauthCookies;
  private renderError: OauthRenderError;
  private readonly oauthConfig: Configuration;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.clients = [
      // Dummy client for testing
      {
        client_id: 'foo',
        client_secret: 'bar',
        redirect_uris: ['https://oidcdebugger.com/debug'],
        grant_types: ['authorization_code'],
        response_types: ['code'],
      },
      // Itself as a client
      {
        client_id: this.configService.get<string>('OAUTH_CLIENT_ID'),
        client_secret: this.configService.get<string>('OAUTH_CLIENT_SECRET'),
        redirect_uris: [
          this.configService.get<string>('OAUTH_CLIENT_REDIRECT_URI'),
        ],
        grant_types: ['authorization_code'],
        response_types: ['code'],
      },
    ];

    this.adapter = PrismaAdapter;

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
          return {
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        },
      };
    };

    this.interactions = {
      url: async (ctx, interaction) => {
        this.logger.log(
          'Generating interactions URL for interaction UID:',
          interaction.uid,
        );

        const url = `http://localhost:3000/client/auth/signin?interactionUid=${interaction.uid}`;
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
        `/client/auth/error?error=${base64url.encode(JSON.stringify(error))}`,
      );
      ctx.res.end();
    };

    this.oauthConfig = {
      clients: this.clients,
      adapter: this.adapter,
      findAccount: this.findAccount,
      interactions: this.interactions,
      features: this.features,
      cookies: this.cookies,
      renderError: this.renderError,
    };
  }

  public getOauthConfig(): Configuration {
    return this.oauthConfig;
  }
}
