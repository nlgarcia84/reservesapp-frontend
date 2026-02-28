import Link from 'next/link';
import { Sidebar } from '../layout/Sidebar';

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
  return (
    <Sidebar open={open} onClose={onClose}>
      <Link href="/dashboard/admin" onClick={onClose}>
        Dashboard
      </Link>
      <Link href="/dashboard/admin/gestio-sales" onClick={onClose}>
        Gestió de Sales
      </Link>
      <Link href="/dashboard/admin/gestio-reserves" onClick={onClose}>
        Gestió Reserves
      </Link>
    </Sidebar>
  );
};
