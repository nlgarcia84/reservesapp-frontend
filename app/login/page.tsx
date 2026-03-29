'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, type AuthResponse } from '@/app/services/auth';
import { Interruptor } from '@/components/layout/Interruptor';
import { InputForm } from '@/components/ui/InputForm';
import { Button } from '@/components/ui/Button';
import { saveToken } from '@/app/services/saveToken';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Cridem a la funció login del servei d'autenticació
      const data: AuthResponse = await login(email, password, rememberMe);

      // Guarden el token, rol i nom en localStorage
      saveToken(data.token, data.role, data.name);

      // Redirigim l'usuari al dashboard corresponent segons el seu rol
      if (data.role === 'ADMIN') {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/dashboard/employee');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Error de login');
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

        {/* Bloc del correu electrònic */}
        <div className="mb-5 w-full">
          <p className="font-semibold pb-2 text-zinc-100">Correu electrònic</p>
          <InputForm
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Bloc de la contrasenya */}
        <div className="mb-6 w-full">
          <p className="font-semibold pb-2 text-zinc-100">Contrasenya</p>
          <div className="mb-4 relative">
            <InputForm
              type={showPassword ? 'text' : 'password'}
              placeholder="Contrasenya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              aria-label={
                showPassword ? 'Amagar contrasenya' : 'Mostrar contrasenya'
              }
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Bloc del Interruptor i recuperació */}
          <div className="mb-2 flex items-center justify-between gap-3">
            <Interruptor
              label=" Recorda'm la sessió"
              checked={rememberMe}
              onChange={setRememberMe}
            />
            <a href="#" className="link">
              Recupera-la aquí
            </a>
          </div>
        </div>

        {/* Botó de login */}
        <div className="w-full">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrant...' : 'Entrar'}
          </Button>
        </div>
        {/* Bloc de registre */}
        <div className="mt-2 text-center">
          <p className="text-sm text-zinc-300 sm:text-base">
            Ancora no ets membre?{' '}
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
