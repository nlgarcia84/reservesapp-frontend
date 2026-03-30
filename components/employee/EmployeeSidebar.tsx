import { RoleSidebar } from '../layout/RoleSidebar';

type EmployeeNavigationSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const EmployeeNavigationSidebar = ({
  open,
  onClose,
}: EmployeeNavigationSidebarProps) => {
  return <RoleSidebar role="employee" open={open} onClose={onClose} />;
};
