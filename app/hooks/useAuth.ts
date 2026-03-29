'use client';

import { useEffect, useState } from 'react';
import { getToken, getRole, getName } from '@/app/services/saveToken';

export const useAuth = () => {
  const [auth, setAuth] = useState({
    token: null as string | null,
    role: null as string | null,
    name: null as string | null,
    isAuthenticated: false,
  });

  useEffect(() => {
    setAuth({
      token: getToken(),
      role: getRole(),
      name: getName(),
      isAuthenticated: !!getToken(),
    });
  }, []);

  return auth;
};
