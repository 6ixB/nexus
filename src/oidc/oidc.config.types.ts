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
