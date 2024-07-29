import {
  AdapterConstructor,
  AdapterFactory,
  CanBePromise,
  ClientMetadata,
  CookiesSetOptions,
  ErrorOut,
  errors,
  FindAccount,
  KoaContextWithOIDC,
} from 'oidc-provider';

export type OauthClients = ClientMetadata[];

export type OauthAdapter = AdapterConstructor | AdapterFactory | undefined;

export type OauthFindAccount = FindAccount | undefined;

export type OauthCookies =
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

export type OauthRenderError =
  | ((
      ctx: KoaContextWithOIDC,
      out: ErrorOut,
      error: errors.OIDCProviderError | Error,
    ) => CanBePromise<undefined | void>) // eslint-disable-line @typescript-eslint/no-invalid-void-type
  | undefined;
