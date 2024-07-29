import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthService } from './auth/auth.service';
import { OauthStrategy } from './auth/strategies/oauth.strategy';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nexus')
    .setDescription('The Nexus API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  // Initialize the auth service that will use its own OAuth2/OIDC provider to authenticate users
  // AuthService is a client of OAuthService, so intialization of AuthService is deferred until the OAuthService is initialized
  const authService = app.get(AuthService);
  await authService.initialize();

  const oauthStrategy = app.get(OauthStrategy);
  oauthStrategy.initialize();
}

bootstrap();
