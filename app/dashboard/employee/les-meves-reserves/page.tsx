'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import {
  getMyReservations,
  deleteReservation,
  type Reservation,
} from '@/app/services/reservation';
import { BackButton } from '@/components/ui/BackButton';
import {
  Clock,
  Users,
  Pencil,
  Trash2,
  Crown,
  UserCircle2,
  Inbox,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LesMevesReservesPage = () => {
  const router = useRouter();
  const { token, userId } = useAuth();
  const [reserves, setReserves] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'mine' | 'invited'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Porta totes les reserves del servidor
    const fetchReserves = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const data = await getMyReservations(token);
        setReserves(data);
      } catch (error) {
        console.error('Error carregant reserves:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReserves();
  }, [token]);

  // Métode per cancelar reserva
  const handleCancel = async (id: number) => {
    if (!confirm('Segur que vols cancel·lar aquesta reserva?')) return;
    try {
      await deleteReservation(id, token!);
      setReserves((prev) => prev.filter((r) => r.id !== id));
      alert('Reserva cancel·lada correctament');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("No s'ha pogut cancel·lar la reserva");
    }
  };

  // Archivo: .../les-meves-reserves/page.tsx
  const handleEdit = async (reserva: Reservation) => {
    const idSala = reserva.room?.id ?? reserva.roomId ?? reserva.room_id;

    if (!idSala) return;

    // IMPORTANTE: Incluir '/employee/' en la ruta
    router.push(
      `/dashboard/employee/reserves/${idSala}?editReservationId=${reserva.id}`,
    );
  };

  // Filtra per tipus de reserva, propia o invitada
  const filteredReserves = reserves
    .filter((r) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Ponemos a las 00:00 para comparar solo el día
      // Filtre de seguretat (frontend) de data de la reserva per si no s'ha esborrat al backend
      const fechaReserva = new Date(r.date);
      if (fechaReserva < hoy) return false;
      // Filtre per separar les reserves propues a les invidades
      if (filter === 'mine') return r.userId?.toString() === userId;
      if (filter === 'invited') return r.userId?.toString() !== userId;
      return true;
    })
    .sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Capçalera i filtres */}
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Agenda de reserves
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestiona les reserves que has organitzat tu mateix i les que has
            estat convidat a participar.
          </p>
        </div>

        <div className="relative flex gap-1 rounded-2xl bg-zinc-900/80 p-1 border border-white/5 backdrop-blur-md">
          {(['all', 'mine', 'invited'] as const).map((f) => {
            const isActive = filter === f;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20"
                    // Configuración sin rebote
                    transition={{
                      type: 'tween',
                      ease: 'easeInOut',
                      duration: 0.3,
                    }}
                    style={{ zIndex: 0 }}
                  />
                )}

                <span className="relative z-10">
                  {f === 'all'
                    ? 'TOTES'
                    : f === 'mine'
                      ? 'LES MEVES'
                      : 'CONVIDADES'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Llistat de reserves */}
      <div className="grid gap-4">
        {filteredReserves.length > 0 ? (
          filteredReserves.map((reserva) => {
            const isOrganizer = reserva.userId.toString() === userId;

            return (
              <div
                key={reserva.id}
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:translate-x-1 ${
                  isOrganizer
                    ? 'border-blue-500/30 bg-blue-500/5'
                    : 'border-zinc-800 bg-zinc-900/40'
                }`}
              >
                <div className="flex flex-col p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-5">
                    {/* Data Block */}
                    <div
                      className={`flex flex-col items-center justify-center rounded-2xl px-4 py-3 text-center min-w-[75px] ${
                        isOrganizer
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {new Date(reserva.date).toLocaleDateString('ca-ES', {
                          month: 'short',
                        })}
                      </span>
                      <span className="text-2xl font-black leading-none">
                        {new Date(reserva.date).getDate()}
                      </span>
                    </div>

                    {/* Informació de la reserva */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {reserva.room?.name || 'Sala de Reunions'}
                        </h3>
                        {isOrganizer ? (
                          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[9px] font-bold text-blue-400 tracking-wider">
                            <Crown size={10} /> ORGANITZADOR
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-zinc-800 border border-white/5 px-2.5 py-0.5 text-[9px] font-bold text-zinc-500 tracking-wider">
                            <UserCircle2 size={10} /> CONVIDAT
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={14} className="text-zinc-600" />{' '}
                          {reserva.startTime} - {reserva.endTime}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Users size={14} className="text-zinc-600" />{' '}
                          {reserva.guests?.length || 0} assistents
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accions / Botons */}
                  <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-4 sm:mt-0 sm:border-0 sm:pt-0">
                    {isOrganizer ? (
                      <>
                        <button
                          onClick={() => handleEdit(reserva)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-blue-400 transition-all hover:bg-zinc-800 hover:text-blue-300"
                          title="Editar reserva"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleCancel(reserva.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                          title="Cancel·lar reserva"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-10 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        Només lectura
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-800/50 bg-zinc-900/20 py-24 text-center">
            <div className="rounded-full bg-zinc-900 p-6 mb-4 border border-white/5">
              <Inbox size={40} className="text-zinc-700" />
            </div>
            <h3 className="text-lg font-bold text-zinc-400">
              No hi ha reserves
            </h3>
            <p className="text-sm text-zinc-600 max-w-[250px] mx-auto mt-1">
              Encara no tens cap reunió programada per a aquest filtre.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <BackButton
          text="Retornar al Dashboard"
          previouspage="/dashboard/employee"
        />
      </div>
    </div>
  );
};

export default LesMevesReservesPage;
