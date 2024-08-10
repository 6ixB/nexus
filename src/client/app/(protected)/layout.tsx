import React from 'react';
import AdminPanelLayout from '@/components/base/admin-panel/admin-panel-layout';

export default function NonAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
