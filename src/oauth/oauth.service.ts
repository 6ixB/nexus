import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Provider from 'oidc-provider';
import {
  OIDC_PROVIDER_MODULE,
  OidcProviderModule,
} from './oauth.provider-module';
import oauthConfig from './oauth.config';
import base64url from 'base64url';

@Injectable()
export class OauthService {
  private logger = new Logger(OauthService.name);

  private readonly provider: Provider;

  private readonly issuerProtocol =
    this.configService.get<string>('SERVER_ENV') === 'production'
      ? 'https'
      : 'http';
  private readonly issuerHost = this.configService.get<string>('SERVER_HOST');
  private readonly issuerPort = this.configService.get<string>('SERVER_PORT');

  constructor(
    private configService: ConfigService,
    @Inject(OIDC_PROVIDER_MODULE)
    private readonly oidcProviderModule: OidcProviderModule,
  ) {
    this.logger.log('Creating OAuth/OIDC provider');

    const issuer = `${this.issuerProtocol}://${this.issuerHost}:${this.issuerPort}`;

    oauthConfig.renderError = async (ctx, out, error) => {
      ctx.res.statusCode = 302;
      ctx.res.setHeader(
        'Location',
        `/client/auth/error?error=${base64url.encode(JSON.stringify(error))}`,
      );
      ctx.res.end();
    };

    this.provider = new oidcProviderModule.Provider(issuer, oauthConfig);
  }

  public getProvider() {
    return this.provider;
  }
}
