import { ClientMetadata, Configuration } from 'oidc-provider';

const clients: ClientMetadata[] = [
  {
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['http:localhost:3000/callback'],
    grant_types: ['authorization_code'],
  },
];

const oidcConfig: Configuration = {
  clients,
};

export default oidcConfig;
