import { Module } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { OidcController } from './oidc.controller';
import { oidcProviderModuleFactory } from './oidc.provider-module';

@Module({
  controllers: [OidcController],
  providers: [oidcProviderModuleFactory(), OidcService],
})
export class OidcModule {}
