// lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  role: 'ADMIN' | 'EMPLOYEE';
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let errorMessage = 'Error de login';
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (error) {}
    throw new Error(errorMessage);
  }

  return res.json(); // se espera { token, role }
};

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<LoginRequest> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    let errorMessage = 'Error de registre';
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (error) {}
    throw new Error(errorMessage);
  }

  return res.json(); // se espera { token, role }
};
