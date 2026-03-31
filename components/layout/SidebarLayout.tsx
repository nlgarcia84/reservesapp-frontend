'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { getAvatarUrl } from '@/app/utils/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipus per a cada enllaç del sidebar
type SidebarLink = {
  href: string;
  label: string;
};

// Props del component SidebarLayout
type SidebarLayoutProps = {
  role: 'admin' | 'employee'; // Rol de l'usuari que determina els enlaces visibles
  open: boolean; // Indica si el sidebar està obert
  onClose: () => void; // Callback per tancar el sidebar
};

// Definició dels enllaços del sidebar segons el rol de l'usuari
// Cada rol té un conjunt diferent de rutes i etiquetes
const roleLinks: Record<'admin' | 'employee', SidebarLink[]> = {
  admin: [
    { href: '/dashboard/admin', label: 'Dashboard' },
    { href: '/dashboard/admin/gestio-sales', label: 'Gestió de Sales' },
    { href: '/dashboard/admin/gestio-reserves', label: 'Gestió Reserves' },
  ],
  employee: [
    { href: '/dashboard/employee', label: 'Dashboard' },
    { href: '/dashboard/employee/gestio-reserves', label: 'Gestió Reserves' },
  ],
};

// Component SidebarLayout: Renderitza un sidebar dinàmic segons el rol
// Inclou tota la estructura i lògica del sidebar
export const SidebarLayout = ({ role, open, onClose }: SidebarLayoutProps) => {
  // Obtenim els enllaços del rol especificat
  const links = roleLinks[role];
  const { name } = useAuth();
  const profileImage = getAvatarUrl(name);
  // Estado para evitar hidratación incorrecta: solo renderizamos el nombre después de montar
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <aside
      className={[
        'fixed left-0 top-0 z-50 h-dvh w-64',
        'border-r border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl',
        'transform transition-transform duration-300 ease-in-out will-change-transform',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <nav className="flex flex-col gap-3 p-6 text-base font-medium [&>a]:rounded-lg [&>a]:border [&>a]:border-white/10 [&>a]:bg-zinc-900/70 [&>a]:px-4 [&>a]:py-2.5 [&>a]:transition-colors [&>a]:hover:bg-zinc-800">
        {/* Mostrem la imatge de perfil i el nom */}
        <div className="flex flex-col items-center gap-3 pb-3 border-b border-white/10">
          <Image
            src={profileImage}
            alt={isMounted ? name || 'Perfil' : 'Perfil'}
            width={64}
            height={64}
            unoptimized
            className="rounded-full object-cover border-2 border-white/20"
          />
          <div className="text-center text-sm font-medium">
            {isMounted ? name || 'Usuari' : 'Usuari'}
          </div>
        </div>
        {/* Renderitzem dinàmicament els enllaços associats al rol */}
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={onClose}>
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-100"
        >
          Amaga
        </button>
      </nav>
    </aside>
  );
};
