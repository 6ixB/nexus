import React from 'react';
import '@/app/globals.css';

export default function NonAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
