export const schema =
  process.env.SERVER_ENV === 'production' ? 'https' : 'http';
export const host = process.env.SERVER_HOST;
export const port = process.env.SERVER_PORT;
export const serverBaseUrl = `${schema}://${host}:${port}`;
export const serverApiBaseUrl = `${serverBaseUrl}/api`;
export const serverApiAuthBaseUrl = `${serverApiBaseUrl}/auth`;
export const serverApiAuthIssuerBaseUrl = `${serverApiBaseUrl}/oidc`;
