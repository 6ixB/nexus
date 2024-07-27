import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Issuer } from 'openid-client';
import { AuthService } from './auth/auth.service';
import { OauthStrategy } from './auth/strategies/oauth.strategy';
import session from 'express-session';
import passport from 'passport';

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

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);

  const issuer = await Issuer.discover('http://localhost:3000/oauth');
  const client = new issuer.Client({
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    redirect_uris: [process.env.OAUTH_CLIENT_REDIRECT_URI],
    response_types: ['code'],
  });

  const authService = app.get(AuthService);
  authService.setIssuer(issuer);
  authService.setClient(client);

  const openIdConnectStrategy = app.get(OauthStrategy);
  openIdConnectStrategy.initialize();
}

bootstrap();
