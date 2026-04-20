'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { getRoomById, getRooms, updateRoom } from '@/app/services/rooms';
import { InputForm } from '@/components/ui/InputForm';
import { InputSelectForm } from '@/components/ui/InputSelectForm';
import { InputFileForm } from '@/components/ui/InputFileForm';
import { BackButton } from '@/components/ui/BackButton';
import { LoaderCircle } from 'lucide-react';

export default function EditRoomPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { token } = useAuth();
  const { isLoading, error, setError, startLoading, stopLoading } =
    useLoadingState();

  const equipementOptions = {
    projector: 'Projector + pantalla',
    whiteboard: 'Pissarra blanca interactiva',
    tv: 'Televisor 55" 4K',
    ac: 'Aire acondicionat',
  };

  // Estats del formulari
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<
    ('projector' | 'whiteboard' | 'tv' | 'ac')[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!token || !id) return;

    const fetchRoomData = async () => {
      try {
        const room = await getRoomById(id as string, token);
        setName(room.name);
        setCapacity(room.capacity.toString());
        setDescription(room.description || '');

        const validEquipment = ['projector', 'whiteboard', 'tv', 'ac'] as const;
        let parsedEquipment: string[] = [];
        if (room.equipment) {
          if (Array.isArray(room.equipment)) {
            parsedEquipment = room.equipment;
          } else if (typeof room.equipment === 'string') {
            try {
              parsedEquipment = JSON.parse(room.equipment);
            } catch {
              parsedEquipment = (room.equipment as string)
                .split(',')
                .map((item) => item.trim());
            }
          }
        }
        setSelectedEquipment(
          parsedEquipment.filter(
            (item): item is (typeof validEquipment)[number] =>
              validEquipment.includes(item as (typeof validEquipment)[number]),
          ),
        );

        if (room.imageUrl) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
          const fullImageUrl = room.imageUrl.startsWith('http')
            ? room.imageUrl
            : `${API_URL}${room.imageUrl}`;
          setImagePreview(fullImageUrl);
        }
      } catch {
        setError('No s’ha pogut carregar la informació de la sala.');
      }
    };

    fetchRoomData();
  }, [id, token, setError]);

  const handleEquipmentChange = (
    key: 'projector' | 'whiteboard' | 'tv' | 'ac',
  ) => {
    setSelectedEquipment((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Neteja bàsica de buits
    const cleanName = name.trim();
    if (!cleanName) {
      setError('El nom de la sala és obligatori.');
      return;
    }

    startLoading();

    try {
      // 2. Obtenim totes les sales per comparar
      const allRooms = await getRooms(token);

      // Busquem si hi ha algun duplicat comparant-ho tot en minúscules
      const isDuplicate = allRooms.some(
        (room) =>
          room.name.toLowerCase() === cleanName.toLowerCase() &&
          room.id.toString() !== id,
      );

      if (isDuplicate) {
        setError(
          `Ja existeix una sala amb el nom "${cleanName}" (no es permeten duplicats per majúscules/minúscules).`,
        );
        stopLoading(false);
        return;
      }

      // 3. Si tot està OK, procedim a guardar
      await updateRoom(
        id,
        cleanName,
        parseInt(capacity),
        selectedEquipment,
        description,
        token as string,
        imageFile || undefined,
        imagePreview,
      );

      stopLoading(true);
      router.push('/dashboard/admin/gestio-sales');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al guardar.';
      setError(
        errorMessage.includes('duplicate')
          ? 'Aquest nom ja està registrat.'
          : errorMessage,
      );
      stopLoading(false);
    }
  };

  return (
    <div className="mb-10 mt-8">
      <h2 className="mb-6 text-2xl font-semibold text-center text-zinc-100">
        Detalls i edició de la sala
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md mx-auto gap-4"
      >
        {/* Nom */}
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

        {/* Capacitat */}
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

        {/* Equipament */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">
            Equipament
          </label>
          <div className="space-y-3">
            {Object.entries(equipementOptions).map(([key, value]) => {
              const typedKey = key as 'projector' | 'whiteboard' | 'tv' | 'ac';
              return (
                <InputSelectForm
                  key={typedKey}
                  id={typedKey}
                  name={typedKey}
                  value={typedKey}
                  label={value}
                  checked={selectedEquipment.includes(typedKey)}
                  onChange={() => handleEquipmentChange(typedKey)}
                  disabled={isLoading}
                />
              );
            })}
          </div>
        </div>

        {/* Imatge */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-base font-medium text-zinc-300">Imatge</label>
          <InputFileForm
            onChange={handleImageChange}
            disabled={isLoading}
            preview={imagePreview}
          />
        </div>

        {/* Descripció */}
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

        {/* Botó Guardar */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 mx-auto w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-black font-semibold hover:bg-zinc-100 cursor-pointer active:scale-95 transition-all duration-150 disabled:opacity-60"
        >
          {isLoading ? 'Desant...' : 'Desar canvis'}
        </button>

        {error && <p className="text-center text-red-400 mt-2">{error}</p>}

        {isLoading && (
          <div className="text-center mt-4">
            <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-400" />
          </div>
        )}
      </form>

      <div className="mt-8">
        <BackButton previouspage="/dashboard/admin/gestio-sales" />
      </div>
    </div>
  );
}
