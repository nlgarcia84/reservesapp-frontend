// components/admin/DeleteRoomForm.tsx
'use client';

import { useState } from 'react';
import { deleteRoom } from '@/app/services/rooms';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { LoaderCircle } from 'lucide-react';

export function DeleteRoomForm() {
  const [name, setName] = useState('');
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } =
    useLoadingState();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('El nom de la sala és obligatori');
      return;
    }

    startLoading();
    try {
      await deleteRoom(name.trim());
      stopLoading(true);
      setName('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminant la sala');
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-100">
        Eliminar sala
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-4/5 lg:w-2/3 mx-auto gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300">
            Nom de la sala
          </label>
          <input
            type="text"
            placeholder="Nom de la Sala p.e: Sala X"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          Eliminar Sala
        </button>

        {/* Error */}
        {error ? <p className="text-center text-red-400">{error}</p> : null}

        {/* Loading */}
        {isLoading ? (
          <div className="text-center mt-4">
            <span className="block text-lg mb-3 text-slate-300">
              Eliminant sala...
            </span>
            <LoaderCircle
              className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
              aria-label="Carregant"
            />
          </div>
        ) : null}

        {/* Success */}
        {showSuccess ? (
          <p className="text-center text-2xl text-blue-400">
            ✓ Sala eliminada!
          </p>
        ) : null}
      </form>
    </div>
  );
}
