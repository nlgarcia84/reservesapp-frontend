import Link from 'next/link';
import { Users } from 'lucide-react'; // Hem tret les altres icones que ja no usem
import { DeleteButton } from '@/components/ui/DeleteButton';

export type Room = {
  id: number;
  name: string;
  capacity: number;
  equipment: ('projector' | 'whiteboard' | 'tv' | 'ac')[];
  description: string;
  imageUrl?: string | null;
};

type RoomCardProps = {
  room: Room;
  isAdmin: boolean;
  onRefresh?: () => void;
};

export const RoomCard = ({ room, isAdmin, onRefresh }: RoomCardProps) => {
  const detailsUrl = isAdmin
    ? `/dashboard/admin/gestio-sales/${room.id}`
    : `/dashboard/employee/sales/${room.id}`;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all hover:border-white/20 hover:bg-zinc-900">
      <div>
        {/* Capçalera amb títol i paperera */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3
            className="text-xl font-bold tracking-tight text-zinc-100 line-clamp-1"
            title={room.name}
          >
            {room.name}
          </h3>

          {isAdmin && (
            <DeleteButton
              codi={room.id}
              name={room.name}
              type="room"
              onDeleted={onRefresh}
            />
          )}
        </div>

        {/* Dades resumides de la sala */}
        <div className="mb-6 space-y-3 text-sm text-zinc-400">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-blue-400 shrink-0" />
            <span>Capacitat per a {room.capacity} persones</span>
          </div>
          {/* Hem eliminat els apartats de descripció i equipament */}
        </div>
      </div>

      {/* Botó principal */}
      <Link href={detailsUrl} className="mt-auto block">
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:scale-95">
          {isAdmin ? 'Editar i veure detalls' : 'Veure detalls i reservar'}
        </button>
      </Link>
    </div>
  );
};
