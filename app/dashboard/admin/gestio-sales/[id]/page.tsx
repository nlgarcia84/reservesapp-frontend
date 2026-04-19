'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useLoadingState } from '@/app/hooks/useLoadingState';
import { getRoomById, updateRoom } from '@/app/services/rooms';
import { InputForm } from '@/components/ui/InputForm';
import { InputSelectForm } from '@/components/ui/InputSelectForm';
import { InputFileForm } from '@/components/ui/InputFileForm';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditRoomPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { token } = useAuth();
    const { isLoading, error, setError, startLoading, stopLoading } = useLoadingState();

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
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
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

                // Parseig segur de l'equipament per evitar errors de format del backend
                let parsedEquipment: string[] = [];

                if (room.equipment) {
                    if (Array.isArray(room.equipment)) {
                        parsedEquipment = room.equipment;
                    } else if (typeof room.equipment === 'string') {
                        try {
                            parsedEquipment = JSON.parse(room.equipment);
                        } catch (e) {
                            parsedEquipment = (room.equipment as string).split(',').map(item => item.trim());
                        }
                    }
                }

                setSelectedEquipment(parsedEquipment);

                if (room.imageUrl) {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
                    const fullImageUrl = room.imageUrl.startsWith('http')
                        ? room.imageUrl
                        : `${API_URL}${room.imageUrl}`;
                    setImagePreview(fullImageUrl);
                }
            } catch (err) {
                setError('No s’ha pogut carregar la informació de la sala.');
            }
        };

        fetchRoomData();
    }, [id, token, setError]);

    const handleEquipmentChange = (key: string) => {
        setSelectedEquipment((prev) =>
            prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
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
            await updateRoom(
                id,
                name,
                capacityNum,
                selectedEquipment,
                description,
                token as string,
                imageFile || undefined
            );
            stopLoading(true);
            router.push('/dashboard/admin/gestio-sales');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al guardar els canvis.');
            stopLoading(false);
        }
    };

    return (
        <div className="mb-10 mt-8">
            <div className="w-full max-w-md mx-auto mb-6">
                <Link href="/dashboard/admin/gestio-sales" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-fit">
                    <ArrowLeft size={20} /> Tornar al llistat
                </Link>
            </div>

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
                        {Object.entries(equipementOptions).map(([key, value]) => (
                            <InputSelectForm
                                key={key}
                                id={key}
                                name={key}
                                value={key}
                                label={value}
                                checked={selectedEquipment.includes(key)}
                                onChange={() => handleEquipmentChange(key)}
                                disabled={isLoading}
                            />
                        ))}
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

                {error && <p className="text-center text-red-400">{error}</p>}

                {isLoading ? (
                    <div className="text-center mt-4">
                        <span className="block text-lg mb-3 text-slate-300">
                            Desant canvis...
                        </span>
                        <LoaderCircle
                            className="mx-auto h-8 w-8 animate-spin text-blue-400 motion-reduce:animate-none"
                            aria-label="Carregant"
                        />
                    </div>
                ) : null}
            </form>
        </div>
    );
}