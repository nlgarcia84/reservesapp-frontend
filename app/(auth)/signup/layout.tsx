import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrarse | RoomyApp',
  description: 'Crea tu cuenta de RoomyApp',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
