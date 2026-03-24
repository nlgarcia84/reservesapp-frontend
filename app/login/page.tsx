'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/auth';
import { Interruptor } from '@/components/layout/Interruptor';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login(email, password); // { token, role }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      data.role === 'ADMIN'
        ? router.replace('/dashboard/admin')
        : router.replace('/dashboard/employee');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 font-sans text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur-sm sm:p-7
              shadow-[0_1px_0_rgba(255,255,255,0.18),0_24px_60px_rgba(0,0,0,0.58),0_0_44px_rgba(255,255,255,0.18),0_0_64px_rgba(59,130,246,0.2),0_0_108px_rgba(251,191,36,0.16)]"
      >
        <div className="mb-6 text-center">
          <p className="mb-2 text-center text-3xl font-bold sm:text-4xl text-white">
            Inicia sessió
          </p>
          <p className="text-sm font-light text-zinc-400 sm:text-base">
            Introdueix les teves credencials per accedir
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div>
          <div className="mb-5 w-full">
            <p className="font-semibold pb-2 text-zinc-100">
              Correu electrònic
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6 w-full">
            <div>
              <p className="font-semibold pb-2 text-zinc-100">Contrasenya</p>
              <input
                type="password"
                placeholder="Contrasenya"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 block w-full rounded-lg border border-white/15 bg-black px-3 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <Interruptor
                label=" Recorda'm la sessió"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <a
                href="#"
                className="text-xs font-semibold text-blue-500 transition-colors hover:text-blue-400"
              >
                Recupera-la aquí
              </a>
            </div>
          </div>
          <div className="w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mb-4 block w-full rounded-lg border border-zinc-200 bg-white p-3 text-base font-medium text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Entrant...' : 'Entrar'}
            </button>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-zinc-300 sm:text-base">
            Encara no ets membre?
            <span className="text-blue-500 font-semibold"> Registrat</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
