import { RoleSidebar } from '../layout/RoleSidebar';

type AdminNavigationSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const AdminNavigationSidebar = ({
  open,
  onClose,
}: AdminNavigationSidebarProps) => {
  return <RoleSidebar role="admin" open={open} onClose={onClose} />;
};
