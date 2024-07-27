import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OauthModule } from 'src/oauth/oauth.module';
import { UsersModule } from 'src/users/users.module';
import { OauthStrategy } from './strategies/oauth.strategy';

@Module({
  imports: [OauthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, OauthStrategy],
  exports: [OauthStrategy],
})
export class AuthModule {}
