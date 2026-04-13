import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestió de Reserves | RoomyApp',
  description: 'Gestiona les reserves de sales',
};

export default function GestioReservesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
