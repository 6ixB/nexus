import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { BaseClient, Issuer } from 'openid-client';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private issuer: Issuer<BaseClient> | undefined;
  private client: BaseClient | undefined;

  constructor(private readonly prismaService: PrismaService) {}

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
