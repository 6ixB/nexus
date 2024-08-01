import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthService } from './auth/auth.service';
import { OidcStrategy } from './auth/strategies/oidc.strategy';

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

  // Initialize the auth service that will use its own OIDC provider to authenticate users
  // AuthService is a client of OidcService, so intialization of AuthService is deferred until the OidcService is initialized
  const authService = app.get(AuthService);
  await authService.initialize();

  const oidcStrategy = app.get(OidcStrategy);
  oidcStrategy.initialize();
}

bootstrap();
