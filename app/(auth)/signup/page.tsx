'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { AuthResponse, register } from '@/app/services/auth';
import { InputForm } from '@/components/ui/InputForm';
import { Button } from '@/components/ui/Button';
import { saveToken } from '@/app/services/saveToken';

const SignUpPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Funció para validar la contrasenya
  const validatePassword = (pwd: string): string | null => {
    // Comprobem longitud mínima de 6 caràcters
    if (pwd.length < 6) {
      return 'La contrasenya ha de tenir almenys 6 caràcters.';
    }

    // Comprovem si hi ha almenys una majúscula (A-Z)
    if (!/[A-Z]/.test(pwd)) {
      return 'La contrasenya ha de contenir almenys una lletra majúscula.';
    }

    // Comprovem si hi ha almenys un número (0-9)
    if (!/[0-9]/.test(pwd)) {
      return 'La contrasenya ha de contenir almenys un número.';
    }

    // Tot correcte
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validacions del formulari
    if (!name.trim()) {
      setError('El nom és obligatori.');
      return;
    }

    if (!email.trim()) {
      setError("L'email és obligatori.");
      return;
    }

    if (password !== confirmPassword) {
      setError('Les contrasenyes no coincideixen.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!acceptTerms) {
      setError("Has d'acceptar els termes i condicions.");
      return;
    }

    setIsLoading(true);

    try {
      // Cridem a la funció register del servei d'autenticació, ens retorna la data de tipus AuthResponse amb el token, el role i el name
      const data: AuthResponse = await register(name, email, password);
      // Guardem el token al ls
      saveToken(data.token, data.role, data.name);
      // Si tot va bé, entra el dashboard
      router.push('/dashboard/employee');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      setError(
        err instanceof Error ? err.message : 'Error en crear el compte.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 font-sans text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-black/80 p-6 backdrop-blur-sm sm:p-8"
      >
        <div className="mb-6 text-center">
          <p className="mb-2 text-center text-3xl font-bold sm:text-4xl text-white">
            Crea el teu compte
          </p>
        </div>

        {/* Bloc del nom i cognoms */}
        <div className="space-y-5">
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">
              Nom i cognoms
            </p>
            <InputForm
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Bloc de l'email */}
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">
              Correu electrònic
            </p>
            <InputForm
              type="email"
              placeholder="nom@empresa.cat"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Bloc de les contrasenyes */}
        <div className="mt-6 space-y-5">
          {/* Contrasenya */}
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">
              Contrasenya
            </p>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 pr-11 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                aria-label={
                  showPasswords ? 'Amagar contrasenya' : 'Mostrar contrasenya'
                }
              >
                {showPasswords ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Repetir contrasenya */}
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">
              Repeteix la contrasenya
            </p>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 pr-11 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                aria-label={
                  showPasswords ? 'Amagar contrasenya' : 'Mostrar contrasenya'
                }
              >
                {showPasswords ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bloc del checkbox de termes */}
        <label className="mt-6 flex items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border border-white/20 bg-black"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
          />
          Accepto els termes d&apos;ús i la política de privacitat.
        </label>

        {/* Bloc d'errors */}
        {error && (
          <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Botó de registre */}
        <div className="mt-6 w-full">
          <Button type="submit" disabled={!acceptTerms || isLoading}>
            {isLoading ? 'Creant compte...' : 'Crear compte'}
          </Button>
        </div>

        {/* Enllaç al login */}
        <div className="mt-3 text-center">
          <p className="text-sm text-zinc-300 sm:text-base">
            Ja tens usuari?{' '}
            <a
              href="/login"
              className="text-blue-500 font-semibold hover:text-blue-400 cursor-pointer"
            >
              Inicia sessió
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
