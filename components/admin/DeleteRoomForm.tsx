// components/admin/DeleteRoomForm.tsx
'use client';

import { useState } from 'react';
import { deleteRoom, getRooms } from '@/app/services/rooms';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { useAuth } from '@/app/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';
import { InputForm } from '@/components/ui/InputForm';

interface DeleteRoomFormProps {
  onRoomDeleted?: () => Promise<void>;
}

const DeleteRoomForm = ({ onRoomDeleted }: DeleteRoomFormProps) => {
  const [name, setName] = useState('');
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } = useLoadingState();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('El nom de la sala és obligatori');
      return;
    }

    startLoading();
    try {
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

      await deleteRoom(room.id, token);
      stopLoading(true);
      setName('');
      await onRoomDeleted?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminant la sala');
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10 flex justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-5">
        
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300 mb-2">
            Nom de la sala a eliminar
          </label>
          <InputForm
            type="text"
            placeholder="Nom de la Sala p.e: Sala X"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          // Li donem un estil vermell per indicar que és una acció perillosa (eliminar)
          className="mb-4 block w-full rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-base font-medium text-red-500 transition-all duration-150 hover:bg-red-500/20 active:scale-95 active:shadow-inner cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          Eliminar Sala
        </button>

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
        
      </form>
    </div>
  );
};

export default DeleteRoomForm;