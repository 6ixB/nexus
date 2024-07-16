import { Logger } from '@nestjs/common';
import { PrismaClient, OidcModel, Prisma } from '@prisma/client';
import { Adapter, AdapterPayload } from 'oidc-provider';

const prisma = new PrismaClient();

const models = [
  'Session', // 1
  'AccessToken', // 2
  'AuthorizationCode', // 3
  'RefreshToken', // 4
  'DeviceCode', // 5
  'ClientCredentials', // 6
  'Client', // 7
  'InitialAccessToken', // 8
  'RegistrationAccessToken', // 9
  'Interaction', // 10
  'ReplayDetection', // 11
  'PushedAuthorizationRequest', // 12
  'Grant', // 13
  'BackchannelAuthenticationRequest', //14
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

export class PrismaAdapter implements Adapter {
  type: number;
  private logger = new Logger(`Oidc${PrismaAdapter.name}`);

  constructor(name: string) {
    this.type = types[name];
  }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn?: number,
  ): Promise<void> {
    this.logger.log(`Upserting ${models[this.type - 1]} with ID: ${id}`);
    this.logger.log(payload);

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
    this.logger.log(`Finding ${models[this.type - 1]} with ID: ${id}`);

    const doc = await prisma.oidcModel.findUnique({
      where: {
        id_type: {
          id,
          type: this.type,
        },
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.log(
        `Find ${models[this.type - 1]} with ID: ${id} not found or expired`,
      );
      return undefined;
    }

    this.logger.log(`Found ${models[this.type - 1]} with ID: ${id}`);
    return prepare(doc);
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    this.logger.log(
      `Finding ${models[this.type - 1]} with UserCode: ${userCode}`,
    );

    const doc = await prisma.oidcModel.findFirst({
      where: {
        userCode,
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.log(
        `FindByUserCode ${models[this.type - 1]} with UserCode: ${userCode} not found or expired`,
      );
      return undefined;
    }

    this.logger.log(
      `Found ${models[this.type - 1]} with UserCode: ${userCode}`,
    );
    return prepare(doc);
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    this.logger.log(`Finding ${models[this.type - 1]} with UID: ${uid}`);

    const doc = await prisma.oidcModel.findUnique({
      where: {
        uid,
      },
    });

    if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
      this.logger.log(
        `FindByUid ${models[this.type - 1]} with UID: ${uid} not found or expired`,
      );
      return undefined;
    }

    this.logger.log(`Found ${models[this.type - 1]} with UID: ${uid}`);
    return prepare(doc);
  }

  async consume(id: string): Promise<void> {
    this.logger.log(`Consuming ${models[this.type - 1]} with ID: ${id}`);

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
    this.logger.log(`Destroying ${models[this.type - 1]} with ID: ${id}`);

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
    this.logger.log(
      `Revoking ${models[this.type - 1]} with GrantId: ${grantId}`,
    );

    await prisma.oidcModel.deleteMany({
      where: {
        grantId,
      },
    });
  }
}

export default PrismaAdapter;
