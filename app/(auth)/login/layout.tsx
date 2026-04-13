import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicia Sessió | RoomyApp',
  description: 'Accedeix al teu compte de RoomyApp',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
