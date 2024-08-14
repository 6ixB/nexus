import { create } from 'zustand';

export type User = {
  sub?: string | undefined;
  email?: string | undefined;
  email_verified?: boolean | undefined;
  name?: string | undefined;
  given_name?: string | undefined;
  family_name?: string | undefined;
  middle_name?: string | undefined;
  nickname?: string | undefined;
  preferred_username?: string | undefined;
  profile?: string | undefined;
  picture?: string | undefined;
  website?: string | undefined;
  gender?: string | undefined;
  birthdate?: string | undefined;
  zoneinfo?: string | undefined;
  locale?: string | undefined;
  updated_at?: string | undefined;
};

export type TokenSet = {
  access_token?: string | undefined;
  refresh_token?: string | undefined;
  id_token?: string | undefined;
  token_type?: string | undefined;
  expires_at?: number | undefined;
  scope?: string | undefined;
};

export type Session = {
  user: User | undefined;
  tokenSet?: TokenSet | undefined;
  endSessionUrl?: string | undefined;
  setUser: (user: User | undefined) => void;
  setTokenSet: (tokenSet: TokenSet | undefined) => void;
  setEndSessionUrl: (endSessionUrl: string | undefined) => void;
};

export const useSessionStore = create<Session>((set) => ({
  user: undefined,
  tokenSet: undefined,
  endSessionUrl: undefined,
  setUser: (user: User | undefined) => set({ user }),
  setTokenSet: (tokenSet: TokenSet | undefined) => set({ tokenSet }),
  setEndSessionUrl: (endSessionUrl: string | undefined) =>
    set({ endSessionUrl }),
}));
