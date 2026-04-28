'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { getMyReservations, deleteReservation, type Reservation } from '@/app/services/reservation';
import { BackButton } from '@/components/ui/BackButton';
import {
    Clock,
    Users,
    Pencil,
    Trash2,
    Crown,
    UserCircle2,
    Inbox
} from 'lucide-react';

const LesMevesReservesPage = () => {
    const { token, userId } = useAuth();
    const [reserves, setReserves] = useState<Reservation[]>([]);
    const [filter, setFilter] = useState<'all' | 'mine' | 'invited'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

    const handleCancel = async (id: number) => {
        if (!confirm('Segur que vols cancel·lar aquesta reserva?')) return;
        try {
            await deleteReservation(id, token!);
            setReserves(prev => prev.filter(r => r.id !== id));
            alert('Reserva cancel·lada correctament');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('No s\'ha pogut cancel·lar la reserva');
        }
    };

    const filteredReserves = reserves.filter(r => {
        if (filter === 'mine') return r.user_id.toString() === userId;
        if (filter === 'invited') return r.user_id.toString() !== userId;
        return true;
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
            {/* CAPÇALERA I FILTRES */}
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">La meva Agenda</h1>
                    <p className="mt-1 text-sm text-zinc-500">Gestiona les teves reunions i invitacions</p>
                </div>

                <div className="flex gap-1 rounded-2xl bg-zinc-900/80 p-1 border border-white/5 backdrop-blur-md">
                    {(['all', 'mine', 'invited'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all ${filter === f
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {f === 'all' ? 'TOTES' : f === 'mine' ? 'LES MEVES' : 'INVITACIONS'}
                        </button>
                    ))}
                </div>
            </div>

            {/* LLISTAT DE RESERVES */}
            <div className="grid gap-4">
                {filteredReserves.length > 0 ? (
                    filteredReserves.map((reserva) => {
                        const isOrganizer = reserva.user_id.toString() === userId;

                        return (
                            <div
                                key={reserva.id}
                                className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:translate-x-1 ${isOrganizer
                                        ? 'border-blue-500/30 bg-blue-500/5'
                                        : 'border-zinc-800 bg-zinc-900/40'
                                    }`}
                            >
                                <div className="flex flex-col p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                    <div className="flex items-center gap-5">
                                        {/* Data Block */}
                                        <div className={`flex flex-col items-center justify-center rounded-2xl px-4 py-3 text-center min-w-[75px] ${isOrganizer ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                {new Date(reserva.date).toLocaleDateString('ca-ES', { month: 'short' })}
                                            </span>
                                            <span className="text-2xl font-black leading-none">
                                                {new Date(reserva.date).getDate()}
                                            </span>
                                        </div>

                                        {/* Informació de la Reserva */}
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-bold text-white leading-tight">
                                                    {reserva.room_name || "Sala de Reunions"}
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
                                                    <Clock size={14} className="text-zinc-600" /> {reserva.start_time} - {reserva.end_time}
                                                </span>
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Users size={14} className="text-zinc-600" /> {reserva.guests?.length || 0} assistents
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accions / Botons */}
                                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-4 sm:mt-0 sm:border-0 sm:pt-0">
                                        {isOrganizer ? (
                                            <>
                                                <button
                                                    onClick={() => alert('Funció d\'edició properament disponible')}
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
                        <h3 className="text-lg font-bold text-zinc-400">No hi ha reserves</h3>
                        <p className="text-sm text-zinc-600 max-w-[250px] mx-auto mt-1">
                            Encara no tens cap reunió programada per a aquest filtre.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-center">
                <BackButton previouspage="/dashboard/employee" />
            </div>
        </div>
    );
};

export default LesMevesReservesPage;