import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import React from 'react';
import '@/app/globals.css';
import Providers from '@/components/providers/providers';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'Nexus',
  description:
    'A Simple Identity Provider and OpenID Connect Authorization Server for your applications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <NextTopLoader color="#7c3aed" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
