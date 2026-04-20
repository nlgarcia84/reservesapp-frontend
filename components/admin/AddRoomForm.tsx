// components/admin/AddRoomForm.tsx
'use client';

import { useState } from 'react';
import { addNewRoom } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { LoaderCircle } from 'lucide-react';
import { InputForm } from '../ui/InputForm';
import { InputSelectForm } from '../ui/InputSelectForm';
import { InputFileForm } from '../ui/InputFileForm';

export const AddRoomForm = () => {
  // Definició dels equipaments disponibles per a les sales amb les seves descripcions
  const equipementOptions = {
    projector: 'Projector + pantalla',
    whiteboard: 'Pissarra blanca interactiva',
    tv: 'Televisor 55" 4K',
    ac: 'Aire acondicionat',
  };

  // Estados del formulari per capturar les dades de la nova sala
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // Fitxer d'imatge seleccionat
  const [imagePreview, setImagePreview] = useState<string>(''); // URL de previsualització de la imatge
  const [selectedEquipment, setSelectedEquipment] = useState<
    ('projector' | 'whiteboard' | 'tv' | 'ac')[]
  >([]); // Array d'equipaments seleccionats

  // Hooks per a autenticació i manejo de estats de càrrega
  const { token } = useAuth();
  const { isLoading, showSuccess, error, setError, startLoading, stopLoading } =
    useLoadingState();

  // Gestiona el canvi d'equipaments: afegeix o elimina según ja estigui seleccionat
  const handleEquipmentChange = (
    key: 'projector' | 'whiteboard' | 'tv' | 'ac',
  ) => {
    setSelectedEquipment(
      (prev) =>
        prev.includes(key)
          ? prev.filter((item) => item !== key) // Si ja està, el quita
          : [...prev, key], // Si no està, l'afegeix
    );
  };

  // Gestiona la selecció i previsualització de la imatge de la sala
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      // Genera una previsualització de la imatge seleccionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Maneja l'enviament del formulari per crear una nova sala
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validació: El nom de la sala és obligatori
    if (!name.trim()) {
      setError('El nom de la sala és obligatori.');
      return;
    }

    // Validació: La capacitat ha de ser un número positiu
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setError('La capacitat ha de ser un número vàlid més gran que 0.');
      return;
    }

    startLoading();
    try {
      const cap = parseInt(capacity, 10);
      // Crida a la funció del servei per crear la sala amb tots els paràmetres
      await addNewRoom(
        name,
        cap,
        selectedEquipment,
        description,
        token,
        imageFile || undefined,
      );
      stopLoading(true);
      // Neteja tots els camps del formulari després de crear exitosament la sala
      setName('');
      setCapacity('');
      setDescription('');
      setSelectedEquipment([]);
      setImageFile(null);
      setImagePreview('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error afegint la sala');
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-100">
        Afegir nova sala
      </h2>
      <form
        className="flex flex-col w-full max-w-md mx-auto gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Camp de nom de la sala */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">
            Nom de la sala
          </label>
          <InputForm
            type="text"
            placeholder="Ex: Sala de reunions A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Camp de capacitat (número de persones) */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">
            Capacitat
          </label>
          <InputForm
            type="number"
            placeholder="Capacitat (núm de persones)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            disabled={isLoading}
            min={0}
          />
        </div>

        {/* Selecció multiple d'equipaments mitjançant checkboxes */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">
            Equipament
          </label>
          <div className="space-y-3">
            {Object.entries(equipementOptions).map(([key, value]) => {
              const equipmentKey = key as
                | 'projector'
                | 'whiteboard'
                | 'tv'
                | 'ac';
              return (
                <InputSelectForm
                  key={key}
                  id={key}
                  name={key}
                  value={equipmentKey} // Pasa la clave (el identificador único)
                  label={value}
                  checked={selectedEquipment.includes(equipmentKey)}
                  onChange={() => handleEquipmentChange(equipmentKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Selecció d'imatge per a la sala amb previsualització */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">Imatge</label>
          <InputFileForm
            onChange={handleImageChange}
            disabled={isLoading}
            preview={imagePreview}
          />
        </div>

        {/* Camp de descripció (textarea) */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">
            Descripció
          </label>
          <textarea
            className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripció de la sala"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Botó d'enviament */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 mx-auto w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-black font-semibold hover:bg-zinc-100 cursor-pointer active:scale-95 transition-all duration-150 disabled:opacity-60"
        >
          {isLoading ? 'Afegint...' : 'Afegir Sala'}
        </button>

        {/* Mostrar missatge d'error si hi ha */}
        {error ? <p className="text-center text-red-400">{error}</p> : null}

        {/* Indicador de càrrega mentre es crea la sala */}
        {isLoading ? (
          <div className="text-center mt-4">
            <span className="block text-lg mb-3 text-slate-300">
              Afegint sala...
            </span>
            <LoaderCircle
              className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
              aria-label="Carregant"
            />
          </div>
        ) : null}

        {/* Mostrar missatge d'èxit après de crear la sala */}
        {showSuccess && (
          <p className="text-green-400 mt-2">Sala afegida correctament!</p>
        )}
      </form>
    </div>
  );
};
