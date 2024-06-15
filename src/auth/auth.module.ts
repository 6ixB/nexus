import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OidcModule } from 'src/oidc/oidc.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [OidcModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
