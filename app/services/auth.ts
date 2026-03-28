// lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
