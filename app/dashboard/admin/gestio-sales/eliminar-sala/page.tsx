'use client';

import { useEffect, useState } from 'react';
import DeleteRoomForm from '@/components/admin/DeleteRoomForm';
import { Card } from '@/components/ui/Card';
import { DoorOpen, LoaderCircle } from 'lucide-react';
import { getRooms } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';

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
            // Llista de sales carregada
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="p-2 rounded bg-zinc-800/50 flex flex-row justify-between"
                >
                  <span className="font-medium text-zinc-100">{room.id}</span>
                  <span className="font-medium text-zinc-100">{room.name}</span>
                  <span className="font-medium text-zinc-100">
                    {room.capacity} places
                  </span>
                </li>
              ))}
            </ul>
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
