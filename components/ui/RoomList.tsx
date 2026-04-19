import { RoomCard } from './RoomCard';

type Room = {
  id: number;
  name: string;
  capacity: number;
  equipment: ('projector' | 'whiteboard' | 'tv' | 'ac')[]; // ✅ Array
  description: string;
  imageUrl?: string | null; // ✅ URL de imagen
};

type RoomListProps = {
  rooms: Room[];
  isAdmin: boolean;
  onRefresh?: () => void;
};

export const RoomList = ({ rooms, isAdmin, onRefresh }: RoomListProps) => {
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

  // Graella responsive
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          isAdmin={isAdmin}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};
