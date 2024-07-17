import { OauthMiddleware } from './oauth.middleware';

describe('OidcMiddleware', () => {
  it('should be defined', () => {
    expect(new OauthMiddleware()).toBeDefined();
  });
});
