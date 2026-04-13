import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RoomyApp | Gestió Intel·ligent de sales',
  description: 'Plataforma de gestió de sales i reserves',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
