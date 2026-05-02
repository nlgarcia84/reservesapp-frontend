'use client';

import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Header } from '@/components/layout/Header';
import { RoleGuard } from '@/components/RoleGuard';
import { useAuth } from '@/app/hooks/useAuth';
import { useState } from 'react';

export default function EmployeeLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role } = useAuth(); // Obtenim el rol actual

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((value) => !value);

  // Ens assegurem quin rol té l'usuari per renderitzar el sidebar adequat
  const currentRole = (role?.toLowerCase() === 'admin' ? 'admin' : 'employee') as 'admin' | 'employee';

  return (
    /* 
      Mantenim el RoleGuard per permetre l'accés a ambdós rols a les rutes d'empleat
    */
    <RoleGuard allowedRoles={['employee', 'admin']}>
      
      {/* Capa de fons fosc quan el sidebar està obert */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* 
          Li passem el rol actual. El component SidebarLayout s'encarregarà
          de mostrar els enllaços d'admin si ets admin, o els d'empleat si ets empleat.
      */}
      <SidebarLayout 
        role={currentRole} 
        open={sidebarOpen} 
        onClose={closeSidebar} 
      />

      <div className="flex min-h-screen flex-col justify-center bg-black font-sans text-zinc-100">
        {/* El Header ara sempre obrirà el sidebar amb els enllaços correctes */}
        <Header 
          sidebarOpen={sidebarOpen} 
          onToggleSidebar={toggleSidebar} 
        />
        
        <main className="ml-auto mr-auto flex-1 p-6 pt-20 w-full max-w-7xl">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}