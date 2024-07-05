import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { NextServer } from 'next/dist/server/next';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const next = require('next');

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

  constructor(private configService: ConfigService) {
    this.logger.log('Creating Next.js application');
    this.logger.log(`Development mode: ${this.dev}`);
    this.logger.log(`Hostname: ${this.hostname}`);
    this.logger.log(`Port: ${this.port}`);
    this.logger.log(`Path: ${this.path}`);

    this.nextApp = next({
      dev: this.dev,
      hostname: this.hostname,
      port: this.port,
      dir: this.path,
    });
  }

  async onModuleInit() {
    await this.nextApp.prepare();
    this.logger.log(
      'Next.js application prepared and ready to handle requests',
    );
  }

  public getNextApp() {
    return this.nextApp;
  }
}
