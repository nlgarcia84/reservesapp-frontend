import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrar-se | RoomyApp',
  description: 'Crea el teu compte de RoomyApp',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
