import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Afegir Sala | RoomyApp',
  description: 'Afegeix una nova sala al sistema',
};

export default function AfegirSalaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
