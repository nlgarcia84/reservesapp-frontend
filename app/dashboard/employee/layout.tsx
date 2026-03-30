'use client';

import { EmployeeNavigationSidebar } from '@/components/employee/EmployeeSidebar';
import { Header } from '@/components/layout/Header';
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
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <EmployeeNavigationSidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-h-screen flex-col justify-center bg-black font-sans text-zinc-100">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main className="ml-auto mr-auto flex-1 p-6 pt-20">{children}</main>
      </div>
    </>
  );
}
