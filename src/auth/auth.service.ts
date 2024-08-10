import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { BaseClient } from 'openid-client';
import { Issuer } from 'openid-client';
import type { AuthSignInDto } from './dto/auth-signin.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private issuer: Issuer<BaseClient> | undefined;
  private client: BaseClient | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  public async initialize() {
    const issuer = await Issuer.discover(
      this.configService.get<string>('OIDC_CLIENT_ISSUER'),
    );
    const client = new issuer.Client({
      client_id: this.configService.get<string>('OIDC_CLIENT_ID'),
      client_secret: this.configService.get<string>('OIDC_CLIENT_SECRET'),
      redirect_uris: [
        this.configService.get<string>('OIDC_CLIENT_REDIRECT_URI'),
      ],
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

  public async authenticate(authSignInDto: AuthSignInDto): Promise<UserEntity> {
    this.logger.log(`Attempting to authenticate ${authSignInDto.email}`);

    const { email, password } = authSignInDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Authentication successful for ${email}`);

    return new UserEntity(user);
  }
}
