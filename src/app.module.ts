import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { OidcModule } from './oidc/oidc.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
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
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { CommonModule } from './common/common.module';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

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
            saveUninitialized: true,
            store: new PrismaSessionStore(prismaService, {
              checkPeriod: 2 * 60 * 1000,
              dbRecordIdIsSessionId: true,
              dbRecordIdFunction: undefined,
            }),
          },
        };
      },
    }),
    CommonModule,
    UsersModule,
    OidcModule,
    AuthModule,
    ClientModule,
    CommonModule,
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
  ],
})
export class AppModule {}
