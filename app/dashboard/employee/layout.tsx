import type { Metadata } from 'next';
import EmployeeLayoutClient from './EmployeeLayoutClient';

export const metadata: Metadata = {
  title: 'Panel Empleado | RoomyApp',
  description: 'Gestiona tus reservas y eventos',
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeeLayoutClient>{children}</EmployeeLayoutClient>;
}
