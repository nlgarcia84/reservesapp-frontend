import { SidebarLayout } from '../layout/SidebarLayout';

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
  return <SidebarLayout role="admin" open={open} onClose={onClose} />;
};
