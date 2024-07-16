import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.use(cookieParser());
  app.use(
    '/_next',
    express.static(path.join(process.cwd(), './src/client/.next')),
  );

  const config = new DocumentBuilder()
    .setTitle('Nexus')
    .setDescription('The Nexus API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
