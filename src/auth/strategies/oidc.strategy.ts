import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import passport from 'passport';
import { Strategy } from 'openid-client';

@Injectable()
export class OidcStrategy {
  private logger = new Logger(OidcStrategy.name);

  constructor(private readonly authService: AuthService) {
    passport.serializeUser((user, done) => {
      this.logger.log(`serializeUser: ${JSON.stringify(user)}`);
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      this.logger.log(`deserializeUser: ${JSON.stringify(user)}`);
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
          this.logger.log('Using OIDC strategy');
          this.logger.log(`tokenSet: ${JSON.stringify(tokenSet)}`);
          this.logger.log(`userinfo: ${JSON.stringify(userInfo)}`);

          const user = { ...userInfo, tokenSet };

          return done(null, user);
        },
      ),
    );
  }
}
