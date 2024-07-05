import React from 'react';
import ReactQueryProvider from '@/components/react-query/ReactQueryProvider';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
