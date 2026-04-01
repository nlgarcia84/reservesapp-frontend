'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Header } from '@/components/layout/Header';
import { RoleGuard } from '@/components/RoleGuard';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((value) => !value);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <AdminSidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-h-screen flex-col justify-center bg-black font-sans text-zinc-100">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main className="ml-auto mr-auto flex-1 p-6 pt-10">{children}</main>
      </div>
    </RoleGuard>
  );
}
