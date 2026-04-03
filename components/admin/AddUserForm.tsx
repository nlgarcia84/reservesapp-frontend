'use client';

import { addUser } from '@/app/services/users';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';
import { InputForm } from '@/components/ui/InputForm';
import { Button } from '../ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } =
    useLoadingState();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nom d'usuari és obligatori");
      return;
    }

    startLoading();
    try {
      await addUser(name.trim(), email, password, token);
      stopLoading(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error afegint l'usuari");
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full mx-auto gap-5"
      >
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300 mb-2">
            Nom de l&apos;usuari
          </label>
          <InputForm
            type="text"
            placeholder="Nom de l'usuari"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300 mb-2">
            E-mail
          </label>
          <InputForm
            type="email"
            placeholder="E-Mail de l'usuari"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-zinc-300 mb-2">
              Password
            </label>
            <InputForm
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
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

        <Button
          type="submit"
          disabled={isLoading}
          className="mx-auto w-full rounded-lg border border-zinc-200 bg-white px-4 py-3
                     text-black font-semibold hover:bg-zinc-100 cursor-pointer
                     active:scale-95 active:shadow-inner transition-all duration-150
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Afegir Usuari
        </Button>

        {/* Error */}
        {error ? <p className="text-center text-red-400">{error}</p> : null}

        {/* Loading */}
        {isLoading ? (
          <div className="text-center mt-4">
            <span className="block text-lg mb-3 text-slate-300">
              Afegint usuari...
            </span>
            <LoaderCircle
              className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
              aria-label="Carregant"
            />
          </div>
        ) : null}

        {/* Success */}
        {showSuccess ? (
          <p className="text-center text-green-400">
            Usuari afegit correctament!
          </p>
        ) : null}
      </form>
    </div>
  );
};
