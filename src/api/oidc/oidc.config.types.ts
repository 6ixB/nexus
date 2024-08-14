import type * as crypto from 'node:crypto';

import type {
  Account,
  AdapterConstructor,
  AdapterFactory,
  CanBePromise,
  CIBADeliveryMode,
  ClientMetadata,
  CookiesSetOptions,
  ErrorOut,
  errors,
  FapiProfile,
  FindAccount,
  JWKS,
  KoaContextWithOIDC,
  ResourceServer,
  TLSClientAuthProperty,
  TTLFunction,
  UnknownObject,
} from 'oidc-provider';

export type OidcClients = ClientMetadata[];

export type OidcAdapter = AdapterConstructor | AdapterFactory | undefined;

export type OidcFindAccount = FindAccount | undefined;

export type OidcCookies =
  | {
      names?:
        | {
            session?: string | undefined;
            interaction?: string | undefined;
            resume?: string | undefined;
            state?: string | undefined;
          }
        | undefined;
      long?: CookiesSetOptions | undefined;
      short?: CookiesSetOptions | undefined;
      keys?: Array<string | Buffer> | undefined;
    }
  | undefined;

export type OidcRenderError =
  | ((
      ctx: KoaContextWithOIDC,
      out: ErrorOut,
      error: errors.OIDCProviderError | Error,
    ) => CanBePromise<undefined | void>) // eslint-disable-line @typescript-eslint/no-invalid-void-type
  | undefined;

export type OidcScopes = string[] | undefined;

export type OidcRoutes =
  | {
      authorization?: string | undefined;
      code_verification?: string | undefined;
      device_authorization?: string | undefined;
      end_session?: string | undefined;
      introspection?: string | undefined;
      jwks?: string | undefined;
      registration?: string | undefined;
      revocation?: string | undefined;
      token?: string | undefined;
      userinfo?: string | undefined;
      backchannel_authentication?: string | undefined;
      pushed_authorization_request?: string | undefined;
    }
  | undefined;

export type OidcFeatures =
  | {
      devInteractions?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      claimsParameter?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      clientCredentials?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      introspection?:
        | {
            enabled?: boolean | undefined;
            allowedPolicy?:
              | ((
                  ctx: KoaContextWithOIDC,
                  client: any,
                  token: any,
                ) => CanBePromise<boolean>)
              | undefined;
          }
        | undefined;

      revocation?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      userinfo?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      jwtUserinfo?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      encryption?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      registration?:
        | {
            enabled?: boolean | undefined;
            initialAccessToken?: boolean | string | undefined;
            policies?:
              | {
                  [key: string]: (
                    ctx: KoaContextWithOIDC,
                    metadata: ClientMetadata,
                  ) => CanBePromise<undefined | void>; // eslint-disable-line @typescript-eslint/no-invalid-void-type
                }
              | undefined;
            idFactory?: ((ctx: KoaContextWithOIDC) => string) | undefined;
            secretFactory?: ((ctx: KoaContextWithOIDC) => string) | undefined;
          }
        | undefined;

      registrationManagement?:
        | {
            enabled?: boolean | undefined;
            rotateRegistrationAccessToken?: any | boolean | undefined;
            issueRegistrationAccessToken?: any | boolean | undefined;
          }
        | undefined;

      deviceFlow?:
        | {
            enabled?: boolean | undefined;
            charset?: 'base-20' | 'digits' | undefined;
            mask?: string | undefined;
            deviceInfo?:
              | ((ctx: KoaContextWithOIDC) => UnknownObject)
              | undefined;
            userCodeInputSource?:
              | ((
                  ctx: KoaContextWithOIDC,
                  form: string,
                  out?: ErrorOut,
                  err?: errors.OIDCProviderError | Error,
                ) => CanBePromise<undefined | void>) // eslint-disable-line @typescript-eslint/no-invalid-void-type
              | undefined;
            userCodeConfirmSource?:
              | ((
                  ctx: KoaContextWithOIDC,
                  form: string,
                  client: any,
                  deviceInfo: UnknownObject,
                  userCode: string,
                ) => CanBePromise<undefined | void>) // eslint-disable-line @typescript-eslint/no-invalid-void-type
              | undefined;
            successSource?:
              | ((ctx: KoaContextWithOIDC) => CanBePromise<undefined | void>)
              | undefined; // eslint-disable-line @typescript-eslint/no-invalid-void-type
          }
        | undefined;

      requestObjects?:
        | {
            request?: boolean | undefined;
            requestUri?: boolean | undefined;
            requireUriRegistration?: boolean | undefined;
            requireSignedRequestObject?: boolean | undefined;
            mode?: 'lax' | 'strict' | undefined;
          }
        | undefined;

      dPoP?:
        | {
            enabled?: boolean | undefined;
            nonceSecret?: Buffer | undefined;
            requireNonce?: (ctx: KoaContextWithOIDC) => boolean;
          }
        | undefined;

      backchannelLogout?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      fapi?:
        | {
            enabled?: boolean | undefined;
            profile:
              | FapiProfile
              | ((ctx: KoaContextWithOIDC, client: any) => FapiProfile)
              | undefined;
          }
        | undefined;

      ciba?:
        | {
            enabled?: boolean | undefined;
            deliveryModes: CIBADeliveryMode[];
            triggerAuthenticationDevice?:
              | ((
                  ctx: KoaContextWithOIDC,
                  request: any,
                  account: Account,
                  client: any,
                ) => CanBePromise<void>)
              | undefined;
            validateBindingMessage?:
              | ((
                  ctx: KoaContextWithOIDC,
                  bindingMessage?: string,
                ) => CanBePromise<void>)
              | undefined;
            validateRequestContext?:
              | ((
                  ctx: KoaContextWithOIDC,
                  requestContext?: string,
                ) => CanBePromise<void>)
              | undefined;
            processLoginHintToken?:
              | ((
                  ctx: KoaContextWithOIDC,
                  loginHintToken?: string,
                ) => CanBePromise<string | undefined>)
              | undefined;
            processLoginHint?:
              | ((
                  ctx: KoaContextWithOIDC,
                  loginHint?: string,
                ) => CanBePromise<string | undefined>)
              | undefined;
            verifyUserCode?:
              | ((
                  ctx: KoaContextWithOIDC,
                  userCode?: string,
                ) => CanBePromise<void>)
              | undefined;
          }
        | undefined;

      webMessageResponseMode?:
        | {
            enabled?: boolean | undefined;
            ack?: string | undefined;
          }
        | undefined;

      jwtIntrospection?:
        | {
            enabled?: boolean | undefined;
            ack?: string | undefined;
          }
        | undefined;

      jwtResponseModes?:
        | {
            enabled?: boolean | undefined;
          }
        | undefined;

      pushedAuthorizationRequests?:
        | {
            requirePushedAuthorizationRequests?: boolean | undefined;
            enabled?: boolean | undefined;
          }
        | undefined;

      rpInitiatedLogout?:
        | {
            enabled?: boolean | undefined;
            postLogoutSuccessSource?:
              | ((ctx: KoaContextWithOIDC) => CanBePromise<undefined | void>) // eslint-disable-line @typescript-eslint/no-invalid-void-type
              | undefined;
            logoutSource?:
              | ((
                  ctx: KoaContextWithOIDC,
                  form: string,
                ) => CanBePromise<undefined | void>) // eslint-disable-line @typescript-eslint/no-invalid-void-type
              | undefined;
          }
        | undefined;

      mTLS?:
        | {
            enabled?: boolean | undefined;
            certificateBoundAccessTokens?: boolean | undefined;
            selfSignedTlsClientAuth?: boolean | undefined;
            tlsClientAuth?: boolean | undefined;
            getCertificate?:
              | ((
                  ctx: KoaContextWithOIDC,
                ) => crypto.X509Certificate | string | undefined)
              | undefined;
            certificateAuthorized?:
              | ((ctx: KoaContextWithOIDC) => boolean)
              | undefined;
            certificateSubjectMatches?:
              | ((
                  ctx: KoaContextWithOIDC,
                  property: TLSClientAuthProperty,
                  expected: string,
                ) => boolean)
              | undefined;
          }
        | undefined;

      resourceIndicators?:
        | {
            enabled?: boolean | undefined;
            getResourceServerInfo?:
              | ((
                  ctx: KoaContextWithOIDC,
                  resourceIndicator: string,
                  client: any,
                ) => CanBePromise<ResourceServer>)
              | undefined;
            defaultResource?:
              | ((
                  ctx: KoaContextWithOIDC,
                  client: any,
                  oneOf?: string[] | undefined,
                ) => CanBePromise<string | string[]>)
              | undefined;
            useGrantedResource?:
              | ((ctx: KoaContextWithOIDC, model: any) => CanBePromise<boolean>)
              | undefined;
          }
        | undefined;
    }
  | undefined;

export type OidcClaims =
  | {
      [key: string]: null | string[];
    }
  | undefined;

export type OidcTtl =
  | {
      AccessToken?: TTLFunction<any> | number | undefined;
      AuthorizationCode?: TTLFunction<any> | number | undefined;
      ClientCredentials?: TTLFunction<any> | number | undefined;
      DeviceCode?: TTLFunction<any> | number | undefined;
      BackchannelAuthenticationRequest?: TTLFunction<any> | number | undefined;
      IdToken?: TTLFunction<any> | number | undefined;
      RefreshToken?: TTLFunction<any> | number | undefined;
      Interaction?: TTLFunction<any> | number | undefined;
      Session?: TTLFunction<any> | number | undefined;
      Grant?: TTLFunction<any> | number | undefined;

      [key: string]: unknown;
    }
  | undefined;

export type OidcJwks = JWKS | undefined;
