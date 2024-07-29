import { Injectable, Logger } from '@nestjs/common';
import { BaseClient, Issuer } from 'openid-client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private issuer: Issuer<BaseClient> | undefined;
  private client: BaseClient | undefined;

  public async initialize() {
    const issuer = await Issuer.discover('http://localhost:3000/oauth');
    const client = new issuer.Client({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirect_uris: [process.env.OAUTH_CLIENT_REDIRECT_URI],
      response_types: ['code'],
    });

    this.setIssuer(issuer);
    this.setClient(client);
  }

  public setIssuer(issuer: Issuer<BaseClient> | undefined) {
    this.issuer = issuer;
  }

  public setClient(client: BaseClient | undefined) {
    this.client = client;
  }

  public getIssuer(): Issuer<BaseClient> | undefined {
    return this.issuer;
  }

  public getClient(): BaseClient | undefined {
    return this.client;
  }
}
