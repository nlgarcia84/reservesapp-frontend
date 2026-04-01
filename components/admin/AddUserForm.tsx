'use client';

import { addUser } from '@/app/services/users';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';

export const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error afegint l'usuari");
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-100">
        Afegir nou usuari
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-4/5 lg:w-2/3 mx-auto gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300">
            Nom de l&apos;usuari
          </label>
          <input
            type="text"
            placeholder="Nou usuari"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="rounded-lg border border-white/15 bg-black px-4 py-2 text-zinc-100 text-center placeholder:text-zinc-500 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300">E-mail</label>
          <input
            type="text"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-lg border border-white/15 bg-black px-4 py-2 text-zinc-100 text-center placeholder:text-zinc-500 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="rounded-lg border border-white/15 bg-black px-4 py-2 text-zinc-100 text-center placeholder:text-zinc-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mx-auto w-full rounded-lg border border-zinc-200 bg-white px-4 py-2
                     text-black font-semibold hover:bg-zinc-100
                     disabled:opacity-60 transition-colors"
        >
          Afegir Usuari
        </button>

        {/* Error */}
        {error ? <p className="text-center text-red-400">{error}</p> : null}

        {/* Loading */}
        {isLoading ? (
          <div className="text-center mt-4">
            <span className="block text-lg mb-3 text-slate-300">
              Afegint Usuari...
            </span>
            <LoaderCircle
              className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
              aria-label="Carregant"
            />
          </div>
        ) : null}

        {/* Success */}
        {showSuccess ? (
          <p className="text-center text-2xl text-blue-400">✓ Usuari afegit!</p>
        ) : null}
      </form>
    </div>
  );
};
