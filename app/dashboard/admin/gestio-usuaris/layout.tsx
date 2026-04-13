import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gestió d'Usuaris | RoomyApp",
  description: 'Gestiona els usuaris del sistema',
};

export default function GestioUsuarisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
