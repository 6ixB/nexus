import React from 'react';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import { ThemeProvider } from './theme-provider';
import { cookies } from 'next/headers';
import SessionProvider from './session-provider';
import { serverApiAuthBaseUrl } from '@/client.constants';

async function getSession() {
  const cookieValues = cookies()
    .getAll()
    .map((cookieObj) => `${cookieObj.name}=${cookieObj.value}`)
    .join('; ');

  try {
    const res = await fetch(`${serverApiAuthBaseUrl}/session/me`, {
      method: 'GET',
      headers: {
        Cookie: cookieValues,
      },
    });

    if (!res.ok) {
      return {};
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

type ProvidersProps = {
  children: React.ReactNode;
};

export default async function Providers({ children }: ProvidersProps) {
  const session = await getSession();

  return (
    <SessionProvider session={session}>
      <ReactQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
