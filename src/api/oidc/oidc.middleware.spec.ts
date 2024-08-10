import { OidcMiddleware } from './oidc.middleware';

describe('OidcMiddleware', () => {
  it('should be defined', () => {
    expect(new OidcMiddleware()).toBeDefined();
  });
});
