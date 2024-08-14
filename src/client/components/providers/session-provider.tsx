'use client';

import type { TokenSet, User } from '@/hooks/use-session-store';
import { useSessionStore, type Session } from '@/hooks/use-session-store';
import { useEffect } from 'react';

type SessionProviderProps = {
  session: Session;
  children: React.ReactNode;
};

export default function SessionProvider({
  session,
  children,
}: SessionProviderProps) {
  const { setUser, setTokenSet, setEndSessionUrl } = useSessionStore();

  const {
    tokenSet: _tokenSet,
    endSessionUrl: _endSessionUrl,
    ..._user
  } = session;

  useEffect(() => {
    setUser(_user as User | undefined);
    setTokenSet(_tokenSet as TokenSet | undefined);
    setEndSessionUrl(_endSessionUrl as string | undefined);
  }, []);

  return <>{children}</>;
}
