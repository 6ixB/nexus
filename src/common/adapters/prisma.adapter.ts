import { Logger } from '@nestjs/common';
import { PrismaClient, OidcModel, Prisma } from '@prisma/client';
import { Adapter, AdapterPayload } from 'oidc-provider';

const prisma = new PrismaClient();

const types = [
  'Session',
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'ClientCredentials',
  'Client',
  'InitialAccessToken',
  'RegistrationAccessToken',
  'Interaction',
  'ReplayDetection',
  'PushedAuthorizationRequest',
  'Grant',
  'BackchannelAuthenticationRequest',
].reduce(
  (map, name, i) => ({ ...map, [name]: i + 1 }),
  {} as Record<string, number>,
);

const prepare = (doc: OidcModel) => {
  const isPayloadJson =
    doc.payload &&
    typeof doc.payload === 'object' &&
    !Array.isArray(doc.payload);

  const payload = isPayloadJson ? (doc.payload as Prisma.JsonObject) : {};

  return {
    ...payload,
    ...(doc.consumedAt ? { consumed: true } : undefined),
  };
};

const expiresAt = (expiresIn?: number) =>
  expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

export class PrismaAdapter implements Adapter {
  type: number;
  private logger = new Logger(PrismaAdapter.name);

  constructor(name: string) {
    this.type = types[name];
  }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn?: number,
  ): Promise<void> {
    this.logger.log(`Upserting ${this.type} ${id}`);

    const data = {
      type: this.type,
      payload: payload as Prisma.JsonObject,
      grantId: payload.grantId,
      userCode: payload.userCode,
      uid: payload.uid,
      expiresAt: expiresAt(expiresIn),
    };

    await prisma.oidcModel.upsert({
      where: {
        id_type: {
          id,
          type: this.type,
        },
      },
      update: {
        ...data,
      },
      create: {
        id,
        ...data,
      },
    });
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    this.logger.log(`Finding ${this.type} ${id}`);

    const doc = await prisma.oidcModel.findUnique({
      where: {
        id_type: {
          id,
          type: this.type,
        },
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.log(`Find ${this.type} ${id} not found`);
      return undefined;
    }

    this.logger.log(`Found ${this.type} ${id}`);
    return prepare(doc);
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    this.logger.log(`Finding ${this.type} by UserCode ${userCode}`);

    const doc = await prisma.oidcModel.findFirst({
      where: {
        userCode,
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.log(`FindByUserCode ${this.type} ${userCode} not found`);
      return undefined;
    }

    this.logger.log(`Found ${this.type} by UserCode ${userCode}`);
    return prepare(doc);
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    this.logger.log(`Finding ${this.type} by UID ${uid}`);

    const doc = await prisma.oidcModel.findUnique({
      where: {
        uid,
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.log(`FindByUid ${this.type} ${uid} not found`);
      return undefined;
    }

    this.logger.log(`Found ${this.type} by UID ${uid}`);
    return prepare(doc);
  }

  async consume(id: string): Promise<void> {
    this.logger.log(`Consuming ${this.type} ${id}`);

    await prisma.oidcModel.update({
      where: {
        id_type: {
          id,
          type: this.type,
        },
      },
      data: {
        consumedAt: new Date(),
      },
    });
  }

  async destroy(id: string): Promise<void> {
    this.logger.log(`Destroying ${this.type} ${id}`);

    await prisma.oidcModel.delete({
      where: {
        id_type: {
          id,
          type: this.type,
        },
      },
    });
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    this.logger.log(`Revoking ${this.type} by GrantId ${grantId}`);

    await prisma.oidcModel.deleteMany({
      where: {
        grantId,
      },
    });
  }
}

export default PrismaAdapter;
