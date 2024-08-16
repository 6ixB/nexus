import { Logger } from '@nestjs/common';
import type { OidcModel, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type { Adapter, AdapterPayload } from 'oidc-provider';

const prisma = new PrismaClient();

const models = [
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
];

const types = models.reduce(
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

export class OidcPrismaAdapter implements Adapter {
  private type: number;
  private logger = new Logger(OidcPrismaAdapter.name);

  constructor(name: string) {
    this.type = types[name];
  }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn?: number,
  ): Promise<void> {
    const data = {
      type: this.type,
      payload: payload as Prisma.JsonObject,
      grantId: payload.grantId,
      userCode: payload.userCode,
      uid: payload.uid,
      expiresAt: expiresAt(expiresIn),
    };

    this.logger.debug(`Upserting ${models[this.type - 1]} with id ${id}`);

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
    this.logger.debug(`Finding ${models[this.type - 1]} with id ${id}`);

    const doc = await prisma.oidcModel.findUnique({
      where: {
        id_type: {
          id,
          type: this.type,
        },
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.debug(`No ${models[this.type - 1]} found with id ${id}`);
      return undefined;
    }

    return prepare(doc);
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    this.logger.debug(
      `Finding ${models[this.type - 1]} with userCode ${userCode}`,
    );

    const doc = await prisma.oidcModel.findFirst({
      where: {
        userCode,
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.debug(
        `No ${models[this.type - 1]} found with userCode ${userCode}`,
      );
      return undefined;
    }

    return prepare(doc);
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    this.logger.debug(`Finding ${models[this.type - 1]} with uid ${uid}`);

    const doc = await prisma.oidcModel.findUnique({
      where: {
        uid,
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.debug(`No ${models[this.type - 1]} found with uid ${uid}`);
      return undefined;
    }

    return prepare(doc);
  }

  async consume(id: string): Promise<void> {
    this.logger.debug(`Consuming ${models[this.type - 1]} with id ${id}`);

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
    this.logger.debug(`Destroying ${models[this.type - 1]} with id ${id}`);

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
    this.logger.debug(
      `Revoking ${models[this.type - 1]}s with grantId ${grantId}`,
    );

    await prisma.oidcModel.deleteMany({
      where: {
        grantId,
      },
    });
  }
}

export default OidcPrismaAdapter;
