'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, type LoginResponse } from '@/app/services/auth';
import { Interruptor } from '@/components/layout/Interruptor';
import { InputForm } from '@/components/ui/InputForm';
import { Button } from '@/components/ui/Button';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data: LoginResponse = await login(email, password); // { token, role }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      data.role === 'ADMIN'
        ? // Si el rol es admin dirigimos al dash del admin
          router.replace('/dashboard/admin')
        : // Si el rol es de empleado al dashdel empleado
          router.replace('/dashboard/employee');
      // Si se produce algún error lo capturamos con el catch
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
        className="w-full max-w-md rounded-2xl bg-black/80 p-5 backdrop-blur-sm sm:p-7"
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
            <InputForm
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6 w-full">
            <div>
              <p className="font-semibold pb-2 text-zinc-100">Contrasenya</p>
              <div className="mb-4">
                <InputForm
                  type="password"
                  placeholder="Contrasenya"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrant...' : 'Entrar'}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-zinc-300 sm:text-base">
            Encara no ets membre?{' '}
            <button
              onClick={() => router.push('/signup')}
              type="button"
              className="text-blue-500 font-semibold hover:text-blue-400 cursor-pointer"
            >
              Registrat
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
