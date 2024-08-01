import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OidcModule } from 'src/oidc/oidc.module';
import { UsersModule } from 'src/users/users.module';
import { OidcStrategy } from './strategies/oidc.strategy';

@Module({
  imports: [UsersModule, OidcModule],
  controllers: [AuthController],
  providers: [AuthService, OidcStrategy],
  exports: [OidcStrategy],
})
export class AuthModule {}
