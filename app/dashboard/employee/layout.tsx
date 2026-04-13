import type { Metadata } from 'next';
import EmployeeLayoutClient from './EmployeeLayoutClient';

export const metadata: Metadata = {
  title: 'Panel Empleat | RoomyApp',
  description: 'Gestiona les teves reserves i events',
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeeLayoutClient>{children}</EmployeeLayoutClient>;
}
