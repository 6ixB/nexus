import type { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { OidcController } from './oidc.controller';
import { oidcProviderModuleFactory } from './oidc.provider-module';
import { ClientModule } from 'src/client/client.module';
import { OidcConfig } from './oidc.config';
import { OidcMiddleware } from './oidc.middleware';

@Module({
  imports: [ClientModule],
  controllers: [OidcController],
  providers: [oidcProviderModuleFactory(), OidcConfig, OidcService],
  exports: [OidcConfig, OidcService],
})
export class OidcModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OidcMiddleware).forRoutes('*');
  }
}
