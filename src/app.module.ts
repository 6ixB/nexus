import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  HttpAdapterHost,
  Reflector,
} from '@nestjs/core';
import {
  PrismaClientExceptionFilter,
  PrismaModule,
  PrismaService,
} from 'nestjs-prisma';
import type { NestSessionOptions } from 'nestjs-session';
import { SessionModule } from 'nestjs-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { ApiModule } from './api/api.module';
import { HttpModule } from '@nestjs/axios';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development.local'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule, PrismaModule],
      inject: [ConfigService, PrismaService],
      useFactory: async (
        configService: ConfigService,
        prismaService: PrismaService,
      ): Promise<NestSessionOptions> => {
        return {
          session: {
            secret: configService.get<string>('OIDC_SESSION_SECRET'),
            resave: false,
            saveUninitialized: false,
            store: new PrismaSessionStore(prismaService, {
              checkPeriod: 2 * 60 * 1000,
              dbRecordIdIsSessionId: true,
              dbRecordIdFunction: undefined,
            }),
            name: '_session',
            cookie: {
              maxAge: 14 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              path: '/',
            },
          },
        };
      },
    }),
    HttpModule,
    ApiModule,
    ClientModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
    },
    {
      provide: APP_FILTER,
      inject: [HttpAdapterHost],
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
