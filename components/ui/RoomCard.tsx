import Link from 'next/link';
import { Users, Monitor, AlignLeft } from 'lucide-react';
import { DeleteButton } from '@/components/ui/DeleteButton';

type Room = {
  id: number;
  name: string;
  capacity: number;
  equipment: string;
  description: string;
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
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-bold tracking-tight text-zinc-100 line-clamp-1" title={room.name}>
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

        <div className="mb-6 space-y-3 text-sm text-zinc-400">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-blue-400 shrink-0" />
            <span>{room.capacity} persones</span>
          </div>
          
          <div className="flex items-start gap-3">
            <Monitor size={18} className="mt-0.5 text-blue-400 shrink-0" />
            <span className="line-clamp-2" title={room.equipment}>
              {room.equipment || 'Sense equipament específic'}
            </span>
          </div>
          
          <div className="flex items-start gap-3">
            <AlignLeft size={18} className="mt-0.5 text-blue-400 shrink-0" />
            <span className="line-clamp-2" title={room.description}>
              {room.description || 'Sense descripció addicional'}
            </span>
          </div>
        </div>
      </div>

      {/* Aquí està el canvi! Hem tret la condició dels colors i ho hem deixat tot blau */}
      <Link href={detailsUrl} className="mt-auto block">
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:scale-95">
          {isAdmin ? 'Editar sala' : 'Veure calendari i reservar'}
        </button>
      </Link>
    </div>
  );
};