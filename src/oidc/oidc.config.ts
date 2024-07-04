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

const oidcConfig: Configuration = {
  adapter,
  clients,
};

export default oidcConfig;
