import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type Provider from 'oidc-provider';
import {
  OIDC_PROVIDER_MODULE,
  OidcProviderModule,
} from './oidc.provider-module';
import { OidcConfig } from './oidc.config';
import type {
  ParameterizedContext,
  DefaultState,
  DefaultContext,
  Next,
} from 'koa';

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

    this.provider.use(async (ctx, next) => {
      this.preMiddleware(ctx, next);
      await next();
      this.postMiddleware(ctx, next);
    });
  }

  private preMiddleware(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ctx: ParameterizedContext<DefaultState, DefaultContext, any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: Next,
  ) {}

  private postMiddleware(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ctx: ParameterizedContext<DefaultState, DefaultContext, any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: Next,
  ) {}

  public getProvider() {
    return this.provider;
  }
}
