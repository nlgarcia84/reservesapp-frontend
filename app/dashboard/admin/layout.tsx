'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Header } from '@/components/layout/Header';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {sidebarOpen && <AdminSidebar />}
      <div className="flex flex-col justify-center">
        <Header sidebar={toggleSidebar} />
        <main className="flex-1 p-6 ml-auto mr-auto">{children}</main>
      </div>
    </>
  );
}
