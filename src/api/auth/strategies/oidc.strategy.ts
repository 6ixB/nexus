import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import passport from 'passport';
import { Strategy } from 'openid-client';

@Injectable()
export class OidcStrategy {
  private logger = new Logger(OidcStrategy.name);

  constructor(private readonly authService: AuthService) {
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  public initialize() {
    const client = this.authService.getClient();

    passport.use(
      'oidc',
      new Strategy(
        {
          client,
          params: {
            scope: 'openid profile email offline_access',
            prompt: 'consent',
          },
          usePKCE: true,
        },
        (tokenSet, userInfo, done) => {
          const endSessionUrl = client.endSessionUrl({
            id_token_hint: tokenSet.id_token,
            client_id: client.metadata.client_id,
            post_logout_redirect_uri:
              client.metadata.post_logout_redirect_uris[0],
            logout_hint: userInfo.sub,
          });

          const user = { ...userInfo, tokenSet, endSessionUrl };
          return done(null, user);
        },
      ),
    );
  }
}
