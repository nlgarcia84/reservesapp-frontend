// components/admin/AddRoomForm.tsx
'use client';

import { useState } from 'react';
import { addNewRoom } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { LoaderCircle } from 'lucide-react';
import { InputForm } from '../ui/InputForm';

export const AddRoomForm = () => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');
  
  const { token } = useAuth();
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } = useLoadingState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nom de la sala és obligatori.');
      return;
    }

    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setError('La capacitat ha de ser un número vàlid més gran que 0.');
      return;
    }

    startLoading();
    try {
      const cap = parseInt(capacity, 10);
      await addNewRoom(name, cap, equipment, description, token);
      stopLoading(true);
      setName('');
      setCapacity('');
      setEquipment('');
      setDescription('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error afegint la sala');
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-100">Afegir nova sala</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto gap-4">
        
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">Nom de la sala</label>
          <InputForm
            type="text"
            placeholder="Ex: Sala de reunions A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">Capacitat</label>
          <InputForm
            type="number"
            placeholder="Capacitat (núm de persones)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">Equipament</label>
          <InputForm
            type="text"
            placeholder="Ex: Projector, Pissarra..."
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">Descripció</label>
          <textarea
            className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripció de la sala"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 mx-auto w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-black font-semibold hover:bg-zinc-100 cursor-pointer active:scale-95 transition-all duration-150 disabled:opacity-60"
        >
          {isLoading ? 'Afegint...' : 'Afegir Sala'}
        </button>

        {error && <p className="text-red-400 mt-2">{error}</p>}
        {showSuccess && <p className="text-green-400 mt-2">Sala afegida correctament!</p>}
      </form>
    </div>
  );
};