import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OidcModule } from './oidc/oidc.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, OidcModule, AuthModule],
})
export class ApiModule {}
