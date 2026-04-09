// components/admin/DeleteRoomForm.tsx
'use client';

import { useState } from 'react';
import { deleteRoom, getRooms } from '@/app/services/rooms';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useAuth } from '@/app/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';
import { InputForm } from '@/components/ui/InputForm';

// Interfície per als paràmetres del component
interface DeleteRoomFormProps {
  // Callback que s'executa quan la sala s'elimina correctament
  onRoomDeleted?: () => Promise<void>;
}

const DeleteRoomForm = ({ onRoomDeleted }: DeleteRoomFormProps) => {
  // Estat del nom de la sala a eliminar
  const [name, setName] = useState('');
  // Hook personalitzat per gestionar carregament, errors i èxit
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } =
    useLoadingState();
  // Token d'autenticació per a les peticions
  const { token } = useAuth();

  // Gestor del formulari d'eliminació
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validació: el nom no pot estar buit
    if (!name.trim()) {
      setError('El nom de la sala és obligatori');
      return;
    }

    // Inicia l'estat de carregament
    startLoading();
    try {
      // Obtenir la llista de sales per trobar l'ID corresponent al nom
      if (!token) {
        setError('Token no disponible');
        stopLoading(false);
        return;
      }

      const rooms = await getRooms(token);
      const room = rooms.find(
        (r) => r.name.toLowerCase() === name.trim().toLowerCase(),
      );

      if (!room) {
        setError('La sala no ha estat trobada');
        stopLoading(false);
        return;
      }

      // Fa una petició DELETE a l'API per eliminar la sala usant l'ID
      await deleteRoom(room.id, token);
      // Operació exitosa: para carregament, limpia el formulari i actualitza la llista
      stopLoading(true);
      setName('');
      await onRoomDeleted?.();
    } catch (err: unknown) {
      // En cas d'error, mostra el missatge i para carregament
      setError(err instanceof Error ? err.message : 'Error eliminant la sala');
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
            Eliminant sala...
          </span>
          <LoaderCircle
            className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
            aria-label="Carregant"
          />
        </div>
      ) : null}

      {/* Missatge d'èxit */}
      {showSuccess ? (
        <p className="text-center text-2xl text-blue-400">✓ Sala eliminada!</p>
      ) : null}
    </div>
  );
};

export default DeleteRoomForm;
