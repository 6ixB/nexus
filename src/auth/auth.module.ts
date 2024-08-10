import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OidcModule } from 'src/oidc/oidc.module';
import { UsersModule } from 'src/users/users.module';
import { OidcStrategy } from './strategies/oidc.strategy';
import { PassportMiddleware } from './middlewares/passport.middleware';
import { PassportSessionMiddleware } from './middlewares/passport-session.middleware';

@Module({
  imports: [UsersModule, OidcModule],
  controllers: [AuthController],
  providers: [AuthService, OidcStrategy],
  exports: [OidcStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PassportMiddleware).forRoutes('*');
    consumer.apply(PassportSessionMiddleware).forRoutes('*');
  }
}
