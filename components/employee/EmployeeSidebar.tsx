import Link from 'next/link';
import { Sidebar } from '../layout/Sidebar';

type EmployeeSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const EmployeeSidebar = ({ open, onClose }: EmployeeSidebarProps) => {
  return (
    <Sidebar open={open} onClose={onClose}>
      <Link href="/dashboard/employee" onClick={onClose}>
        Dashboard
      </Link>
      <Link href="/dashboard/admin/gestio-reserves" onClick={onClose}>
        Gestió Reserves
      </Link>
    </Sidebar>
  );
};
