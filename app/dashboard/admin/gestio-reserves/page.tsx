'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import {
  getAllReservations,
  deleteReservation,
  type Reservation,
} from '@/app/services/reservation';
import { Clock, User, Trash2, Pencil, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';

const GestioReserves = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [reserves, setReserves] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const data = await getAllReservations(token);
        setReserves(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const reservesAgrupades = useMemo(() => {
    return reserves.reduce((acc: { [key: string]: Reservation[] }, res) => {
      const salaNom = res.room?.name || `Sala ${res.roomId || res.room_id}`;
      if (!acc[salaNom]) acc[salaNom] = [];
      acc[salaNom].push(res);
      return acc;
    }, {});
  }, [reserves]);

  const handleEdit = (reserva: Reservation) => {
    // Obtenim l'id de la sala de la reserva
    const idSala = reserva.room?.id ?? reserva.roomId ?? reserva.room_id;
    router.push(
      `/dashboard/employee/reserves/${idSala}?editReservationId=${reserva.id}`,
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Vols eliminar aquesta reserva com a administrador?')) return;
    try {
      await deleteReservation(id, token!);
      setReserves((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Error en eliminar la reserva');
    }
  };

  return (
    <div className="p-5 pt-8 sm:pt-12 flex flex-col items-center">
      {/* Títol */}
      <div className="w-full flex justify-center">
        <h1 className="mb-10 w-fit rounded-2xl border border-white/10 bg-zinc-950/70 p-7 px-12 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Panell administrador de reserves
        </h1>
      </div>

      {/* Contingut */}
      <div className="w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-semibold text-zinc-200">
            Sales amb activitat
          </h2>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
            {Object.keys(reservesAgrupades).length} sales actives
          </span>
        </div>

        {/* Llistat de reserves agrupades per sala */}
        {isLoading ? (
          <div className="flex justify-center p-20 text-zinc-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <p className="uppercase tracking-widest text-[10px] font-bold">
                Carregant sistema...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
            {Object.entries(reservesAgrupades).map(([salaNom, llista]) => (
              <div
                key={salaNom}
                className="rounded-3xl border border-white/5 bg-zinc-900/20 p-6 flex flex-col shadow-2xl backdrop-blur-sm"
              >
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                  <LayoutGrid size={18} className="text-blue-500" /> {salaNom}
                </h2>
                <div className="space-y-4 flex-1">
                  {llista
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((res) => (
                      <div
                        key={res.id}
                        className="flex custom-scrollbar group relative rounded-2xl border border-white/5 bg-zinc-950/40 p-4 transition-all hover:bg-zinc-900/40"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            {new Date(res.date).toLocaleDateString('ca-ES', {
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(res)}
                              className="p-1.5 hover:text-blue-400 text-zinc-600 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(res.id)}
                              className="p-1.5 hover:text-red-500 text-zinc-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 mb-1">
                          <Clock size={12} className="text-zinc-500" />{' '}
                          {res.startTime} - {res.endTime}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium italic">
                          <User size={10} /> Organitzador:{' '}
                          <span className="text-zinc-400">{res.userId}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BackButton
        text={'Tornar al Dashboard'}
        previouspage={'/dashboard/admin'}
      />
    </div>
  );
};

export default GestioReserves;
