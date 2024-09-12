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
import { HttpService } from '@nestjs/axios';
import base64url from 'base64url';

@Injectable()
export class OidcService {
  private logger = new Logger(OidcService.name);

  private readonly provider: Provider;

  constructor(
    private readonly configService: ConfigService,
    @Inject(OIDC_PROVIDER_MODULE)
    private readonly oidcProviderModule: OidcProviderModule,
    private readonly oidcConfig: OidcConfig,
    private readonly httpService: HttpService,
  ) {
    const issuer = `${this.oidcConfig.getOrigin()}/api/oidc`;

    this.provider = new oidcProviderModule.Provider(
      issuer,
      oidcConfig.getOidcConfig(),
    );

    this.provider.use(async (ctx, next) => {
      this.preMiddleware(ctx, next);
      await next();
      this.postMiddleware(ctx, next);
    });

    this.provider.on('end_session.error', async (ctx) => {
      this.logger.error(ctx);
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
