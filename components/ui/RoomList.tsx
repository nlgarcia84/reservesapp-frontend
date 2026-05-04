import { useState, useEffect, useRef } from 'react';
import { RoomCard } from './RoomCard';
import { type Room } from '@/app/services/rooms';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type RoomListProps = {
  rooms: Room[];
  isAdmin: boolean;
  onRefresh?: () => void;
};

export const RoomList = ({ rooms, isAdmin, onRefresh }: RoomListProps) => {
  // Estats per pagina les sales
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  const paginatedItems = rooms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // No seleccionem cap sala per defecte
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const prevSelectedRoomId = useRef<number | null>(selectedRoomId);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Detecta la direcció del moviment
  const handleSelectRoom = (roomId: number) => {
    const prevIdx = paginatedItems.findIndex((r) => r.id === selectedRoomId);
    const nextIdx = paginatedItems.findIndex((r) => r.id === roomId);
    setDirection(nextIdx > prevIdx ? 'right' : 'left');
    setSelectedRoomId(roomId);
  };

  // Quan canvïi la pàgina, deselecciona qualsevol sala
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedRoomId(null);
  }, [page, rooms]);

  useEffect(() => {
    prevSelectedRoomId.current = selectedRoomId;
  }, [selectedRoomId]);

  // Gestionem l'estat buit
  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/50 p-10 text-center">
        <p className="text-lg font-medium text-zinc-300">
          No hi ha sales disponibles en aquest moment.
        </p>
        {isAdmin && (
          <p className="mt-2 text-sm text-zinc-500">
            Afegeix-ne una de nova utilitzant el botó superior.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-around gap-2 mt-6 mb-5">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span>
          Pàgina {page} de {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedItems.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isAdmin={isAdmin}
            onRefresh={onRefresh}
            isSelected={room.id === selectedRoomId}
            onClick={() => handleSelectRoom(room.id)}
            direction={room.id === selectedRoomId ? direction : undefined}
          />
        ))}
      </div>
    </>
  );
};
