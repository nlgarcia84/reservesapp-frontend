import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | RoomyApp',
  description: 'Accede a tu cuenta de RoomyApp',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
