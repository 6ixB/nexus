import { create } from 'zustand';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SessionState {
  user: User | null;
  tokenSet: {
    accessToken: string;
    refreshToken: string;
  } | null;
  setUser: (user: User | null) => void;
  setTokenSet: (
    tokenSet: { accessToken: string; refreshToken: string } | null,
  ) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  tokenSet: null,
  setUser: (user: User | null) => set({ user }),
  setTokenSet: (
    tokenSet: { accessToken: string; refreshToken: string } | null,
  ) => set({ tokenSet }),
  clearSession: () => set({ user: null, tokenSet: null }),
}));
