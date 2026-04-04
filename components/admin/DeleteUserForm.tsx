'use client';

import { useState } from 'react';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useAuth } from '@/app/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';

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
    </div>
  );
};

export default DeleteUserForm;
