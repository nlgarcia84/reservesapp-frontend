'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Pàgina de ruta raíz (localhost:3000)
 *
 * Aquesta pàgina actua com a dispatcher:
 * - Si l'usuari té token vàlid → redirig al seu dashboard (admin/employee)
 * - Si NO té token o està expirat → redirig a la pàgina de login
 *
 * No es mostra res al usuari, només es veu una pantalla de càrrega
 * mentre el hook useAuth verifica la sessió
 */
export default function HomePage() {
  const { token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no hi ha token emmagatzemat, l'usuari no està autenticat
    if (!token) {
      router.push('/login');
      return;
    }

    // Si hi ha token, redirigir al dashboard corresponent segons el rol
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === 'admin') {
      // Els admins van al dashboard d'amministració
      router.push('/dashboard/admin');
    } else if (normalizedRole === 'employee') {
      // Els empleats van al seu dashboard
      router.push('/dashboard/employee');
    } else {
      // Si el rol no és vàlid, tornar a login
      router.push('/login');
    }
  }, [token, role, router]);

  // Mostrar una pantalla de càrrega mentre es processa la redirecció
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <p className="text-zinc-100">Carregant...</p>
    </div>
  );
}
