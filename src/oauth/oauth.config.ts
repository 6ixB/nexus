import { Logger } from '@nestjs/common';
import { ClientMetadata, Configuration } from 'oidc-provider';
import PrismaAdapter from 'src/oauth/adapters/prisma.oauth-adapter';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('OauthConfig');

const clients: ClientMetadata[] = [
  {
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['https://oidcdebugger.com/debug'],
    grant_types: ['authorization_code'],
    response_types: ['code'],
  },
  {
    client_id: 'nexus',
    client_secret: 'wj91Ww6NEE2pWKuByvhnB188ydhBckA/1QiHGmbTRoZB',
    redirect_uris: ['http://localhost:3000/auth/callback'],
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
  long: {
    path: '/',
  },
  short: {
    path: '/',
  },
  keys: ['some-secret-key', 'another-secret-key'],
};

const oauthConfig: Configuration = {
  adapter,
  clients,
  interactions,
  features,
  cookies,
};

export default oauthConfig;
