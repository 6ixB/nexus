import React from 'react';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
