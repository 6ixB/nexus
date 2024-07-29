import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Provider from 'oidc-provider';
import {
  OIDC_PROVIDER_MODULE,
  OidcProviderModule,
} from './oauth.provider-module';
import { OauthConfig } from './oauth.config';

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
    private oauthConfig: OauthConfig,
  ) {
    this.logger.log('Creating OAuth/OIDC provider');

    const issuer = `${this.issuerProtocol}://${this.issuerHost}:${this.issuerPort}`;

    this.provider = new oidcProviderModule.Provider(
      issuer,
      oauthConfig.getOauthConfig(),
    );
  }

  public getProvider() {
    return this.provider;
  }
}
