import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AccountClaims, Configuration } from 'oidc-provider';
import OidcPrismaAdapter from './adapters/prisma.oidc-adapter';
import { PrismaService } from 'nestjs-prisma';
import type {
  OidcAdapter,
  OidcClients,
  OidcCookies,
  OidcFindAccount,
  OidcRenderError,
  OidcScopes,
  OidcRoutes,
  OidcClaims,
  OidcFeatures,
  OidcTtl,
  OidcJwks,
} from './oidc.config.types';
import { ClientRoute } from 'src/client/client.routes';
import base64url from 'base64url';
import { parse } from 'node-html-parser';

@Injectable()
export class OidcConfig {
  private readonly logger = new Logger(OidcConfig.name);

  private clients: OidcClients;
  private adapter: OidcAdapter;
  private findAccount: OidcFindAccount;
  private interactions;
  private features: OidcFeatures;
  private cookies: OidcCookies;
  private renderError: OidcRenderError;
  private scopes: OidcScopes;
  private routes: OidcRoutes;
  private claims: OidcClaims;
  private ttl: OidcTtl;
  private jwks: OidcJwks;
  private readonly oidcConfig: Configuration;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.clients = [
      {
        client_id: this.configService.get<string>('OIDC_CLIENT_ID'),
        client_secret: this.configService.get<string>('OIDC_CLIENT_SECRET'),
        redirect_uris: [
          this.configService.get<string>('OIDC_CLIENT_REDIRECT_URI'),
        ],
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        post_logout_redirect_uris: [
          this.configService.get<string>(
            'OIDC_CLIENT_POST_LOGOUT_REDIRECT_URI',
          ),
        ],
      },
      // Axiom - This is a test client
      {
        client_id: 'axiom',
        client_secret: 'EwLUoeuPWmkU+wVsMbXJW14ua8qHaXIb4P4blYhYAEma',
        redirect_uris: ['http://localhost:4000/api/auth/callback/nexus'],
        grant_types: ['authorization_code'],
        response_types: ['code'],
      },
    ];

    this.scopes = ['openid', 'profile', 'email', 'offline_access'];

    this.claims = {
      openid: ['sub'],
      email: ['email', 'email_verified'],
      profile: [
        'name',
        'family_name',
        'given_name',
        'middle_name',
        'nickname',
        'preferred_username',
        'profile',
        'picture',
        'website',
        'gender',
        'birthdate',
        'zoneinfo',
        'locale',
        'updated_at',
      ],
      address: ['address'],
      phone: ['phone_number', 'phone_number_verified'],
    };

    this.adapter = OidcPrismaAdapter;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.findAccount = async (ctx, sub, token) => {
      const user = await this.prismaService.user.findUnique({
        where: { email: sub },
      });

      if (!user) {
        return;
      }

      return {
        accountId: sub,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async claims(use, scope, claims, rejected) {
          const allClaims = {
            email: user.email,
            email_verified: false,
            name: `${user.firstName} ${user.lastName}`,
            given_name: user.firstName,
            family_name: user.lastName,
          };

          let scopeClaims: AccountClaims = { sub: user.id };

          if (scope.includes('profile')) {
            scopeClaims = {
              ...scopeClaims,
              name: allClaims.name,
              given_name: allClaims.given_name,
              family_name: allClaims.family_name,
            };
          }

          if (scope.includes('email')) {
            scopeClaims = {
              ...scopeClaims,
              email: allClaims.email,
              email_verified: allClaims.email_verified,
            };
          }

          return scopeClaims;
        },
      };
    };

    this.interactions = {
      url: async (ctx, interaction) => {
        const url = `http://localhost:3000/auth/signin/${interaction.uid}`;
        return url;
      },
    };

    this.features = {
      devInteractions: { enabled: false },
      rpInitiatedLogout: {
        enabled: true,
        async logoutSource(ctx, form) {
          const formElement = parse(form);
          const xsrf = formElement
            .querySelector('input[name="xsrf"]')
            ?.getAttribute('value');

          const url = new URL(
            `${ClientRoute.AUTH_SIGNOUT.replace('/:xsrf', '')}/${base64url.encode(xsrf)}`,
            'http://localhost:3000',
          );

          ctx.redirect(url.toString());
        },
        postLogoutSuccessSource(ctx) {
          const url = new URL(
            ClientRoute.AUTH_SIGNOUT_SUCCESS,
            'http://localhost:3000',
          );
          ctx.redirect(url.toString());
        },
      },
      introspection: { enabled: true },
      revocation: { enabled: true },
    };

    this.cookies = {
      long: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
      },
      short: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      },
      keys: ['some-secret-key', 'another-secret-key'],
      names: {
        interaction: '_interaction',
        resume: '_interaction_resume',
        session: '_session',
        state: '_state',
      },
    };

    this.renderError = async (ctx, out, error) => {
      const url = new URL(
        `${ClientRoute.AUTH_ERROR.replace('/:error', '')}/${base64url.encode(JSON.stringify(error))}`,
        'http://localhost:3000',
      );
      ctx.redirect(url.toString());
    };

    this.ttl = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      AccessToken: function AccessTokenTTL(ctx, token, client) {
        return token.resourceServer?.accessTokenTTL || 60 * 60; // 1 hour in seconds
      },
      AuthorizationCode: 60 /* 1 minute in seconds */,
      BackchannelAuthenticationRequest:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function BackchannelAuthenticationRequestTTL(ctx, request, client) {
          if (ctx?.oidc && ctx.oidc.params.requested_expiry) {
            return Math.min(10 * 60, +ctx.oidc.params.requested_expiry); // 10 minutes in seconds or requested_expiry, whichever is shorter
          }

          return 10 * 60; // 10 minutes in seconds
        },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ClientCredentials: function ClientCredentialsTTL(ctx, token, client) {
        return token.resourceServer?.accessTokenTTL || 10 * 60; // 10 minutes in seconds
      },
      DeviceCode: 600 /* 10 minutes in seconds */,
      Grant: 1209600 /* 14 days in seconds */,
      IdToken: 3600 /* 1 hour in seconds */,
      Interaction: 3600 /* 1 hour in seconds */,
      RefreshToken: function RefreshTokenTTL(ctx, token, client) {
        if (
          ctx &&
          ctx.oidc.entities.RotatedRefreshToken &&
          client.applicationType === 'web' &&
          client.clientAuthMethod === 'none' &&
          !token.isSenderConstrained()
        ) {
          // Non-Sender Constrained SPA RefreshTokens do not have infinite expiration through rotation
          return ctx.oidc.entities.RotatedRefreshToken.remainingTTL;
        }

        return 14 * 24 * 60 * 60; // 14 days in seconds
      },
      Session: 1209600 /* 14 days in seconds */,
    };

    this.routes = {
      authorization: '/authorize',
      backchannel_authentication: '/backchannel',
      code_verification: '/device',
      device_authorization: '/device/authorize',
      end_session: '/session/end',
      introspection: '/token/instrospect',
      jwks: '/jwks',
      pushed_authorization_request: '/request',
      registration: '/register',
      revocation: '/token/revoke',
      token: '/token',
      userinfo: '/me',
    };

    this.jwks = {
      keys: [
        {
          p: 'x17-HNTtb7Xj4K_CNzk0EZ7yzd0j4CyrjoJXsHGBLYDJ9I2yKh9YTBY77iQhOVtjdJOFqw8jxulK9nfIX2U2XyNnlWBSz-KRri7sP7dLjfP4hG9Yc4YEc31y5Kd3URTUCD7uInJvMDzPqnCmhc4flNKK1enbxX1m_Gn5m8B6pMs',
          kty: 'RSA',
          q: 'xaxYb-oLINHHrwnH3Fv1lseKckQWkcJohye5FGmvihL4k8-P2uv-FmjigSohGPLbhjVxUZiFUBbGkj3GBRiCB9yP6N3opIwDQOZMKISXKCVf42mVX4SOl72hytudRnv0u6J8sxR6OsBzrF4omCJ1I8qlurDlPrCbUr-7izjpS4k',
          d: 'BlI35FGDwenrjIG7QoLU26Xe3W39DoJ9vewXBe9Tsa1NkYwAoqp0hw0dox7dnrvVbv3oBd3M_qPViBIs2piFkpcQ8X-bWTrKh_0FPXEYqVrTXWaOu_2xtZ_tilwIr_fiw4uV032qEHrfk8da5NEhCc4W77EKUSkceO9egVCHwoxWyqjd0GJNpJKUSdLIjYh8vSjh46M2y_nrXkcz_fK7-iQ82RwFzRVLii49qQDL4rYpviop7FbhXB3GW7SbOrBjFZ_vHx2JulrQE3-TAY4aXJe1jHX5fgjcIOLuD_LrJkw5Y1JII5B6twN6GN4AfsjPWAvwMwLqbk68o9awmYLz8Q',
          e: 'AQAB',
          use: 'sig',
          kid: 'elqgQnbJOnLHNEWdCLsL8iktfE6_r22ICyJ7U4d-e0k',
          qi: 'keKUiVIYSBjV1EmwGty4o7sRtMBzs_frsmYgG4tKqxovgqYVQ3uglIZ2q5YegxuyuIbgphBv8J1KAjwHjBxmYXXYDuATaOc5v8sWZlXO_YYs8CmsaoWIotW1EenwhdIZS7pkCgKCz80yDphorRp3H0WR31Pqs662-Uo3T1giflQ',
          dp: 'a8zlQdmv-LM04AyoywtXKB_10XI9L713lbrMh08YNe5pRJ5JM5V3PMzY4s8OV-EeSa5qnC-3fJowOkxSP6KOX6rZG1_V5ynu82vTui_13m-IdLNv9CcGyRuPwCr8zQ6iB0Nfp6iQjliTQOlgYQEu-l1NTJUCjCpeQSVcHedZaTk',
          alg: 'RS256',
          dq: 'e8nHBCar21yj0PCuEUghTtAc2hvbimIVdXYhyC-69xuUQXQ9IRqiXsRF_B825NnJMY2sLi32ZkYtCg3XQP-tBmFQWcMF2m2359-Ql9sYkdJ97vsCyPNJHKtrc47-OdKMWyiRMNBFDx_QEIRSpZsGgmh4SqZWmWCdlD9voer85gk',
          n: 'mfJSPrsJXRp9nV_3RVwfcGuMQMVZkQh9nQv7PupeqBkLBWG3w2jakPJ2LSPvaLAzQm816w3gRJLmZoY5V79TiVYMzSghkOYyTcZ3h5hQ57FMmkvtmLo9Y_L7jl87RHRSI82FMSJ9ln4mfs3t8PipO8FIkJkpyDLD-eWABHl9lOWdT8zwX3g78iTXZbwm1FWKHWRUofOc854nYK2Sc2AV762B7aflwYYzQuEnmXTrzUBzKHfmKBHliAZahVIq9uHDX8QxYZbEPMi6B2SYqxrtJsQDZ3yEju-3xqUXShg3aGOD0EMc3H6EJqnm3sz2oUUbofkgWBPSu3x0IPyjVKypow',
        },
      ],
    };

    this.oidcConfig = {
      clients: this.clients,
      scopes: this.scopes,
      adapter: this.adapter,
      findAccount: this.findAccount,
      interactions: this.interactions,
      features: this.features,
      cookies: this.cookies,
      renderError: this.renderError,
      claims: this.claims,
      routes: this.routes,
      jwks: this.jwks,
      ttl: this.ttl,
    };
  }

  public getOidcConfig(): Configuration {
    return this.oidcConfig;
  }
}
