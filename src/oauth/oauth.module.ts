import { MiddlewareConsumer, Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { oidcProviderModuleFactory } from './oauth.provider-module';
import { ClientModule } from 'src/client/client.module';
import { OauthConfig } from './oauth.config';
import { OauthMiddleware } from './oauth.middleware';

@Module({
  imports: [ClientModule],
  controllers: [OauthController],
  providers: [oidcProviderModuleFactory(), OauthConfig, OauthService],
  exports: [OauthConfig, OauthService],
})
export class OauthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OauthMiddleware).forRoutes('*');
  }
}
