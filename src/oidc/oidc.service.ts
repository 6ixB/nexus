import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Provider from 'oidc-provider';
import {
  OIDC_PROVIDER_MODULE,
  OidcProviderModule,
} from './oidc.provider-module';
import { OidcConfig } from './oidc.config';

@Injectable()
export class OidcService {
  private logger = new Logger(OidcService.name);

  private readonly provider: Provider;

  private readonly issuerProtocol =
    this.configService.get<string>('SERVER_ENV') === 'production'
      ? 'https'
      : 'http';
  private readonly issuerHost = this.configService.get<string>('SERVER_HOST');
  private readonly issuerPort = this.configService.get<string>('SERVER_PORT');

  constructor(
    private readonly configService: ConfigService,
    @Inject(OIDC_PROVIDER_MODULE)
    private readonly oidcProviderModule: OidcProviderModule,
    private readonly oidcConfig: OidcConfig,
  ) {
    this.logger.log('Creating OIDC provider');

    const issuer = `${this.issuerProtocol}://${this.issuerHost}:${this.issuerPort}`;

    this.provider = new oidcProviderModule.Provider(
      issuer,
      oidcConfig.getOidcConfig(),
    );
  }

  public getProvider() {
    return this.provider;
  }
}
