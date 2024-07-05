import { Logger } from '@nestjs/common';
import { ClientMetadata, Configuration } from 'oidc-provider';
import PrismaAdapter from 'src/common/adapters/prisma.adapter';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('OidcConfig');

const clients: ClientMetadata[] = [
  {
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['https://oidcdebugger.com/debug'],
    grant_types: ['authorization_code'],
    response_types: ['code'],
  },
];

const adapter = PrismaAdapter;

const interactions = {
  url: async (ctx, interaction) => {
    logger.log(
      'Generating interactions URL for interaction UID:',
      interaction.uid,
    );

    const url = `http://localhost:3000/client/auth/signin?interactionUid=${interaction.uid}`;

    logger.log('Generated URL:', url);

    return url;
  },
};

const features = {
  devInteractions: { enabled: false },
};

const cookies = {
  short: {
    path: '/',
  },
  keys: ['some-secret-key', 'another-secret-key'],
};

const oidcConfig: Configuration = {
  adapter,
  clients,
  interactions,
  features,
  cookies,
};

export default oidcConfig;
