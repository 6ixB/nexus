import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';
import Providers from '@/components/base/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nexus',
  description:
    'A Simple Identity Provider, OAuth 2.0 and OpenID Connect Authorization Server for your applications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <Providers>{children} </Providers>
      </body>
    </html>
  );
}
