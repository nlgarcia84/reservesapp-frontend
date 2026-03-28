const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signup = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error en login');
  }

  return res.json(); // se espera { token, role }
};
