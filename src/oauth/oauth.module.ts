import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { oidcProviderModuleFactory } from './oauth.provider-module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [ClientModule],
  controllers: [OauthController],
  providers: [oidcProviderModuleFactory(), OauthService],
  exports: [OauthService],
})
export class OauthModule {}
