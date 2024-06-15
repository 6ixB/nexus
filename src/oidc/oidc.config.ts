import { Logger } from '@nestjs/common';
import { ClientMetadata, Configuration } from 'oidc-provider';
import PrismaAdapter from 'src/common/adapters/prisma.adapter';

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

const cookies = {
  keys: ['some_super_secret_key1', 'some_super_secret_key2'],
};

const interactions = {
  url: async (ctx, interaction) => {
    logger.log(
      'Generating interactions URL for interaction UID:',
      interaction.uid,
    );

    const url = `/auth/signin/${interaction.uid}`;

    logger.log('Generated URL:', url);

    return url;
  },
};

const features = {
  devInteractions: { enabled: false },
};

const oidcConfig: Configuration = {
  adapter,
  clients,
  cookies,
  interactions,
  features,
};

export default oidcConfig;
