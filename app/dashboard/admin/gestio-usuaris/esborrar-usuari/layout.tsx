import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Esborrar Usuari | RoomyApp',
  description: 'Elimina un usuari del sistema',
};

export default function EsborrarUsuariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
