import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eliminar Sala | RoomyApp',
  description: 'Elimina una sala del sistema',
};

export default function EliminarSalaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
