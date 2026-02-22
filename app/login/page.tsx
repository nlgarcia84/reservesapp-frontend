'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/auth';
import Image from 'next/image';
import logo from '../../public/logo_reservesapp.png';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password); // { token, role }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      data.role === 'ADMIN'
        ? router.replace('/dashboard/admin')
        : router.replace('/dashboard/employee');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center pb-10 mb-5">
        <Image
          src={logo}
          alt="logo de ReservesApp"
          width={150}
          height={150}
          loading="eager"
        />
        <span
          className="text-emerald-400 font-bold text-4xl mb-2
             [text-shadow:0_0_25px_rgba(52,211,153,0.55)]"
        >
          ReservesApp
        </span>
        <span className="text-slate-300 font-light">
          Gestió de sales i reserves
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-emerald-600 rounded-2xl ring-2 ring-emerald-400/30
             shadow-[0_0_25px_rgba(52,211,153,0.35)] p-10 w-full px-4 sm:px-6 md:px-8 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
      >
        <div className="text-center mb-5">
          <p className="text-white text-xl sm:text-4xl mb-2 text-center font-bold">
            Inicia sessió
          </p>
          <p className="text-slate-300 font-light">
            Introdueix les teves credencials per accedir
          </p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="p-2">
          <div className="w-full md:w-4/5 lg:w-2/3 mx-auto">
            <p className="font-bold pb-2">Correu electrònic</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full sm:w-3/4 md:w-full lg:w-full mx-auto p-3 mb-4 border rounded bg-slate-300 text-black"
              required
            />
          </div>

          <div className="w-full md:w-4/5 lg:w-2/3 mx-auto">
            <p className="font-bold pb-2">Contrasenya</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full sm:w-3/4 md:w-full lg:w-full mx-auto p-3 mb-4 border rounded bg-slate-300 text-black"
              required
            />
          </div>

          <div className="w-full md:w-4/5 lg:w-2/3 mx-auto">
            <button
              type="submit"
              className="block w-full sm:w-3/4 md:w-full lg:w-full mx-auto text-slate-950 text-lg p-3 border rounded bg-emerald-400 font-mono hover:bg-emerald-300"
            >
              Entrar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
