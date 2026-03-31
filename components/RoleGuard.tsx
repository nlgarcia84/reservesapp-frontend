'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type RoleGuardProps = {
  allowedRoles: ('admin' | 'employee')[];
  children: React.ReactNode;
};

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { role, token } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Esperar a que useAuth haya leído del localStorage
    const timer = setTimeout(() => {
      // Si no hay token, no está autenticado
      if (!token) {
        router.push('/login');
        return;
      }

      // Si no hay rol, algo está mal
      if (!role) {
        router.push('/login');
        return;
      }

      // Normalizar el rol a minúsculas
      const normalizedRole = role.toLowerCase() as 'admin' | 'employee';

      // Verificar que el rol está en los roles permitidos
      if (allowedRoles.includes(normalizedRole)) {
        // Autorizado ✓
        setIsChecking(false);
      } else {
        // Rol no autorizado para esta ruta, redirigir a su dashboard
        const redirectPath =
          normalizedRole === 'admin'
            ? '/dashboard/admin'
            : '/dashboard/employee';
        router.push(redirectPath);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [role, token, allowedRoles, router]);

  // Mostrar loading mientras se verifica
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <p className="text-zinc-100">Carregant...</p>
      </div>
    );
  }

  return <>{children}</>;
};
