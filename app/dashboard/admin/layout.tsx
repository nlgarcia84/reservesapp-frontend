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

  const toggleSidebar = () => setSidebarOpen((value) => !value);

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <AdminSidebar open={sidebarOpen} onClose={toggleSidebar} />
      <div className="flex flex-col justify-center">
        <Header sidebar={toggleSidebar} />
        <main className="flex-1 p-6 ml-auto mr-auto">{children}</main>
      </div>
    </>
  );
}
