'use client';

import { useState } from 'react';
import { InputForm } from '@/components/ui/InputForm';
import { Button } from '@/components/ui/Button';

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 font-sans text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-black/80 p-6 backdrop-blur-sm sm:p-8"
      >
        <div className="mb-6 text-center">
          <p className="mb-2 text-center text-3xl font-bold sm:text-4xl text-white">Crea el teu compte</p>
        </div>

        <div className="space-y-5">
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">Nom i cognoms</p>
            <InputForm
              type="text"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">Correu electrònic</p>
            <InputForm
              type="email"
              placeholder="nom@empresa.cat"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">Contrasenya</p>
            <InputForm
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p className="pb-2 text-sm font-semibold text-zinc-200">Repeteix la contrasenya</p>
            <InputForm
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

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

        <div className="mt-6 w-full">
          <Button type="submit" disabled={!acceptTerms}>
            Crear compte
          </Button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-zinc-300 sm:text-base">
            Ja tens usuari?{' '}
            <a href="/login" className="text-blue-500 font-semibold hover:text-blue-400 cursor-pointer">
              Inicia sessió
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
