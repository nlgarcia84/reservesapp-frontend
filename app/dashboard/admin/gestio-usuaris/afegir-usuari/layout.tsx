import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Afegir Usuari | RoomyApp',
  description: 'Afegeix un nou usuari al sistema',
};

export default function AfegirUsuariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
