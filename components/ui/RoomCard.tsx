import Link from 'next/link';
import Image from 'next/image'; // Canviem l'import
import { Users, Image as ImageIcon } from 'lucide-react';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { type Room } from '@/app/services/rooms';

type RoomCardProps = {
  room: Room;
  isAdmin: boolean;
  onRefresh?: () => void;
};

export const RoomCard = ({ room, isAdmin, onRefresh }: RoomCardProps) => {
  const detailsUrl = isAdmin
    ? `/dashboard/admin/gestio-sales/${room.id}`
    : `/dashboard/employee/sales/${room.id}`;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const imageSrc = room.imageUrl?.startsWith('http')
    ? room.imageUrl
    : room.imageUrl
    ? `${API_URL}${room.imageUrl}`
    : null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all hover:border-white/20 hover:bg-zinc-900">
      
      {/* Contenidor de la imatge amb posició relativa per al 'fill' */}
      <div className="relative h-48 w-full shrink-0 bg-zinc-950/80 border-b border-white/5 overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`Fotografia de ${room.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={isAdmin} // Prioritza la càrrega si és el panell d'admin
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-zinc-600">
            <ImageIcon size={40} className="mb-2 opacity-30" />
            <span className="text-xs font-medium uppercase tracking-wider opacity-50">Sense imatge</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-4 flex items-start justify-between gap-2">
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
              <span>Capacitat per a {room.capacity} persones</span>
            </div>
          </div>
        </div>

        <Link href={detailsUrl} className="mt-auto block">
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:scale-95">
            {isAdmin ? 'Editar i veure detalls' : 'Veure detalls i reservar'}
          </button>
        </Link>
      </div>
    </div>
  );
};