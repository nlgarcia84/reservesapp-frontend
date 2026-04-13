import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestió de Sales | RoomyApp',
  description: 'Gestiona les sales del sistema',
};

export default function GestioSalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
