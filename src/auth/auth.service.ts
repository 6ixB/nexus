import { Injectable, Logger } from '@nestjs/common';
import { BaseClient, Issuer } from 'openid-client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private issuer: Issuer<BaseClient> | undefined;
  private client: BaseClient | undefined;

  setIssuer(issuer: Issuer<BaseClient> | undefined) {
    this.issuer = issuer;
  }

  setClient(client: BaseClient | undefined) {
    this.client = client;
  }

  getIssuer(): Issuer<BaseClient> | undefined {
    return this.issuer;
  }

  getClient(): BaseClient | undefined {
    return this.client;
  }
}
