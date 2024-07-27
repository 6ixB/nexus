import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import passport from 'passport';
import { Strategy } from 'openid-client';

@Injectable()
export class OauthStrategy {
  private logger = new Logger(OauthStrategy.name);

  constructor(private authService: AuthService) {
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
      'oauth',
      new Strategy({ client }, (tokenSet, userinfo, done) => {
        this.logger.log('Using OAuth strategy');
        this.logger.log(`tokenSet: ${JSON.stringify(tokenSet)}`);
        this.logger.log(`userinfo: ${JSON.stringify(userinfo)}`);
        return done(null, userinfo);
      }),
    );
  }
}
