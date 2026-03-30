import Link from 'next/link';
import { SidebarLayout } from './SidebarLayout';

// Tipus per a cada enllaç del sidebar
type SidebarLink = {
  href: string;
  label: string;
};

// Props del component RoleSidebar
type RoleSidebarProps = {
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

// Component RoleSidebar: Renderitza un sidebar dinàmic segons el rol
// Reutilitza el component Sidebar genèric i passa els enllaços corresponents al rol
export const RoleSidebar = ({ role, open, onClose }: RoleSidebarProps) => {
  // Obtenim els enllaços del rol especificat
  const links = roleLinks[role];

  return (
    <SidebarLayout open={open} onClose={onClose}>
      {/* Renderitzem dinàmicament els enllaços associats al rol */}
      {links.map((link) => (
        <Link key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </Link>
      ))}
    </SidebarLayout>
  );
};
