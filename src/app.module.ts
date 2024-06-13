import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OidcModule } from './oidc/oidc.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development.local'],
    }),
    OidcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
