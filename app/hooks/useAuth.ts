'use client';

import { useEffect, useState } from 'react';
import { getToken, getRole, getName } from '@/app/services/saveToken';

export const useAuth = () => {
  // Inicializar sincronamente (no en useEffect) para Client Components
  const [auth, setAuth] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        token: null as string | null,
        role: null as string | null,
        name: null as string | null,
        isAuthenticated: false,
      };
    }

    return {
      token: getToken(),
      role: getRole(),
      name: getName(),
      isAuthenticated: !!getToken(),
    };
  });

  useEffect(() => {
    // Força una actualización si el logout ha ocorregut
    const token = getToken();
    setAuth({
      token,
      role: getRole(),
      name: getName(),
      isAuthenticated: !!token,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return auth;
};
