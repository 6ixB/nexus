import type { OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import next from 'next';
import type { NextServer } from 'next/dist/server/next';
import * as path from 'path';

@Injectable()
export class ClientService implements OnModuleInit {
  private logger = new Logger(ClientService.name);

  private readonly dev =
    this.configService.get<string>('SERVER_ENV') !== 'production';
  private readonly hostname = this.configService.get<string>('SERVER_HOST');
  private readonly port = this.configService.get<number>('SERVER_PORT');
  private readonly path = path.resolve(
    process.cwd(),
    this.configService.get<string>('CLIENT_PATH'),
  );

  private nextApp: NextServer;

  constructor(private readonly configService: ConfigService) {
    this.nextApp = next({
      dev: this.dev,
      hostname: this.hostname,
      port: this.port,
      dir: this.path,
    });
  }

  async onModuleInit() {
    await this.nextApp.prepare();
  }

  public getNextApp() {
    return this.nextApp;
  }
}
