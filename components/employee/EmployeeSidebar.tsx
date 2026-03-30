import { SidebarLayout } from '../layout/SidebarLayout';

type EmployeeSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const EmployeeSidebar = ({ open, onClose }: EmployeeSidebarProps) => {
  return <SidebarLayout role="employee" open={open} onClose={onClose} />;
};
