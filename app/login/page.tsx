'use client';

import { useState } from 'react';
import { login } from '@/lib/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password); // { token, role }

      // Mostrar respuesta del backend (temporal) y redirigir según rol
      console.log('Login response:', data);
      window.location.href =
        data.role === 'admin' ? '/dashboard/admin' : '/dashboard/employee';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-white text-3xl mb-6 text-center font-light">
          Accés
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-3/4 mx-auto p-3 mb-4 border rounded bg-slate-300 text-black"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-3/4 mx-auto p-3 mb-4 border rounded bg-slate-300 text-black"
          required
        />

        <button
          type="submit"
          className="block w-3/4 mx-auto text-slate-950 text-lg p-2 p-3 border rounded bg-emerald-400"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
