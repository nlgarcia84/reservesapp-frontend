// components/admin/DeleteUserForm.tsx
'use client';

import { useState } from 'react';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useAuth } from '@/app/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';
import { InputForm } from '@/components/ui/InputForm';

// Interfície per als paràmetres del component
interface DeleteUserFormProps {
  onUserDeleted?: () => Promise<void>;
}

// Canviem a export const perquè el test ho pugui importar correctament
export const DeleteUserForm = ({ onUserDeleted }: DeleteUserFormProps) => {
  const [name, setName] = useState('');
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } = useLoadingState();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validació per al test: comprovem si està buit
    if (!name.trim()) {
      setError("El nom d'usuari és obligatori");
      return;
    }

    startLoading();
    try {
      // La teva lògica original de fetch directament amb el nom
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${name.trim()}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      stopLoading(true);
      setName('');
      await onUserDeleted?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error esborrant l'usuari");
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10 flex justify-center">
      {/* Afegim el formulari que els tests estaven buscant */}
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-5">
        
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300 mb-2">
            Nom de l&apos;usuari a eliminar
          </label>
          <InputForm
            type="text"
            placeholder="Nom usuari p.e: admin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mb-4 block w-full rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-base font-medium text-red-500 transition-all duration-150 hover:bg-red-500/20 active:scale-95 active:shadow-inner cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          Esborrar Usuari
        </button>

        {/* Missatge d'error */}
        {error ? <p className="text-center text-red-400">{error}</p> : null}

        {/* Indicador de carregament */}
        {isLoading ? (
          <div className="text-center mt-4">
            <span className="block text-lg mb-3 text-slate-300">
              Esborrant usuari...
            </span>
            <LoaderCircle
              className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
              aria-label="Carregant"
            />
          </div>
        ) : null}

        {/* Missatge d'èxit */}
        {showSuccess ? (
          <p className="text-center text-2xl text-blue-400">
            ✓ Usuari esborrat correctament!
          </p>
        ) : null}
      </form>
    </div>
  );
};