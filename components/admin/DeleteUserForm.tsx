'use client';

import { useState } from 'react';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useAuth } from '@/app/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';
import { InputForm } from '@/components/ui/InputForm';

// Interfície per als paràmetres del component
interface DeleteUserFormProps {
  // Callback que s'executa quan l'usuari s'esborra correctament
  onUserDeleted?: () => Promise<void>;
}

const DeleteUserForm = ({ onUserDeleted }: DeleteUserFormProps) => {
  // Estat del nom d'usuari a esborrar
  const [name, setName] = useState('');
  // Hook personalitzat per gestionar carregament, errors i èxit
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } =
    useLoadingState();
  // Token d'autenticació per a les peticions
  const { token } = useAuth();

  // Gestor del formulari d'esborrament
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validació: el nom no pot estar buit
    if (!name.trim()) {
      setError("El nom de l'usuari és obligatori");
      return;
    }

    // Inicia l'estat de carregament
    startLoading();
    try {
      // Fa una petició DELETE a l'API per esborrar l'usuari
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${name.trim()}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Si la resposta no és correcta, genera un error
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      // Operació exitosa: para carregament, limpia el formulari i actualitza la llista
      stopLoading(true);
      setName('');
      await onUserDeleted?.();
    } catch (err: unknown) {
      // En cas d'error, mostra el missatge i para carregament
      setError(err instanceof Error ? err.message : "Error esborrant l'usuari");
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-100">
        Esborrar usuari
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full mx-auto gap-4"
      >
        {/* Camp de text per introduir el nom de l'usuari */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-zinc-300">
            Nom de l&apos;usuari
          </label>
          <InputForm
            type="text"
            placeholder="Nom usuari p.e: admin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Botó de submissió */}
        <button
          type="submit"
          disabled={isLoading}
          className="mx-auto w-full rounded-lg border border-zinc-200 bg-white px-4 py-3
                     text-black font-semibold hover:bg-zinc-100 cursor-pointer
                     active:scale-95 active:shadow-inner transition-all duration-150
                     disabled:opacity-60 disabled:cursor-not-allowed"
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
          <p className="text-center text-green-400">
            Usuari esborrat correctament!
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default DeleteUserForm;
