'use client';

import { useEffect, useState } from 'react';
import DeleteRoomForm from '@/components/admin/DeleteRoomForm';
import { Card } from '@/components/ui/Card';
import { DoorOpen, LoaderCircle } from 'lucide-react';
import { getRooms } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';
import { DeleteButton } from '@/components/ui/DeleteButton';

type Room = {
  id: number;
  name: string;
  capacity: number;
};

const EliminaSala = () => {
  // Token d'autenticació de l'usuari
  const { token } = useAuth();
  // Estat de les sales carregades
  const [rooms, setRooms] = useState<Room[]>([]);
  // Estat per controlar si s'està carregant la llista
  const [roomsLoading, setRoomsLoading] = useState(true);

  // Funció per actualitzar la llista de sales (s'usa com callback del formulari)
  const refetchRooms = async () => {
    if (!token) return;
    try {
      const data = await getRooms(token);
      setRooms(data);
    } catch (err) {
      console.error('Error obtenint sales:', err);
    }
  };

  // Effect que s'executa en carregar la pàgina per obtenir la llista de sales
  useEffect(() => {
    if (!token) return;

    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        // Obté la llista de sales de l'API
        const data = await getRooms(token);
        setRooms(data);
      } catch (err) {
        console.error('Error obtenint sales:', err);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, [token]); // Es re-executa si el token canvia

  return (
    <>
      <div className="p-5">
        <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Eliminar sala
        </h1>
        {/* Tarjeta que mostra la llista de sales */}
        <Card title={'Llistat de sales'} icon={DoorOpen}>
          {/* Mostra carregador mentre s'obtenen les sales */}
          {roomsLoading ? (
            <div className="text-center">
              <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : rooms.length === 0 ? (
            // Missatge si no hi ha sales
            <p className="text-center text-zinc-400">
              No hi ha sales disponibles
            </p>
          ) : (
            // Llista de sales carregada amb scroll blau
            <div className="max-h-64 overflow-y-auto scrollbar-blue">
              <style>{`
                .scrollbar-blue::-webkit-scrollbar {
                  width: 8px;
                }
                .scrollbar-blue::-webkit-scrollbar-track {
                  background: rgba(24, 24, 27, 0.5);
                  border-radius: 10px;
                }
                .scrollbar-blue::-webkit-scrollbar-thumb {
                  background: #60a5fa;
                  border-radius: 10px;
                }
                .scrollbar-blue::-webkit-scrollbar-thumb:hover {
                  background: #3b82f6;
                }
              `}</style>

              <ul className="space-y-2">
                {rooms.map((room) => (
                  <li
                    key={room.id}
                    className="rounded bg-zinc-800/50 flex flex-row justify-between items-center p-5 gap-4"
                  >
                    <span className="font-medium text-zinc-100 min-w-12">
                      {room.id}
                    </span>
                    <span className="font-medium text-zinc-100 flex-1">
                      {room.name}
                    </span>
                    <span className="font-medium text-zinc-100 whitespace-nowrap">
                      {room.capacity} places
                    </span>
                    <DeleteButton
                      codi={room.id}
                      type="room"
                      onDeleted={refetchRooms}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
        {/* Formulari per eliminar sales amb callback per actualitzar la llista */}
        <div className="text-center mb-2">
          <DeleteRoomForm onRoomDeleted={refetchRooms} />
        </div>
      </div>
    </>
  );
};

export default EliminaSala;
