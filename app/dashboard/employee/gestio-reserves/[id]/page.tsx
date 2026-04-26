'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { getRoomById, type Room } from '@/app/services/rooms';
import { createReservation } from '@/app/services/reservation';
import { getUsers } from '@/app/services/users';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import {
    Users,
    Tv,
    Projector,
    PenTool,
    Wind,
    CalendarDays,
    Info,
    CheckCircle2,
    Clock,
    UserPlus,
    X,
    Search
} from 'lucide-react';

// Actualitzem la interfície segons el teu users.ts per incloure el role si el necessitem
interface User {
    id: number;
    name: string;
    email: string;
    role?: string; // Afegim role com a opcional
}

const DetallReservaPage = () => {
    const { id } = useParams();
    const { token, userId } = useAuth(); //userId ens serveix per filtrar-nos a nosaltres mateixos
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [room, setRoom] = useState<Room | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [reservaDate, setReservaDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedGuests, setSelectedGuests] = useState<number[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!token || !id) return;
        try {
            setIsLoading(true);
            const [roomData, usersData] = await Promise.all([
                getRoomById(id as string, token),
                getUsers(token)
            ]);
            setRoom(roomData);

            // FILTRE: 
            // 1. Que no sigui l'usuari actual (userId)
            // 2. Que no sigui administrador (si el camp role existeix a la teva base de dades)
            const validUsers = usersData.filter((u: User) => {
                // 1. No sóc jo mateix
                const isNotMe = u.id.toString() !== userId;

                // 2. No és admin (comprova si el camp es diu 'role' o 'rol')
                // Afegim el toLowerCase per si al backend està com "ADMIN" o "Admin"
                const isNotAdmin = u.role?.toLowerCase() !== 'admin' && u.role?.toLowerCase() !== 'administrator';

                return isNotMe && isNotAdmin;
            });

            setAllUsers(validUsers);
        } catch (error) {
            console.error('Error carregant dades:', error);
        } finally {
            setIsLoading(false);
        }
    }, [id, token, userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleReserva = async () => {
        if (!token || !id || !userId) return;

        try {
            await createReservation({
                room_id: id as string,
                user_id: userId,
                date: reservaDate,
                startTime: startTime,
                endTime: endTime,
                guests: selectedGuests.map(g => g.toString())
            }, token);

            alert('Reserva realitzada correctament!');
            setReservaDate('');
            setStartTime('');
            setEndTime('');
            setSelectedGuests([]);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al realitzar la reserva';
            alert(message);
        }
    };

    const toggleGuest = (guestId: number) => {
        setSelectedGuests(prev =>
            prev.includes(guestId)
                ? prev.filter(id => id !== guestId)
                : [...prev, guestId]
        );
    };

    const filteredUsers = allUsers.filter(user =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !selectedGuests.includes(user.id)
    );

    const selectedGuestObjects = allUsers.filter(u => selectedGuests.includes(u.id));

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!room) return <div className="text-center p-10 text-zinc-400">No s&apos;ha trobat la sala.</div>;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const imageSrc = room.imageUrl?.startsWith('http')
        ? room.imageUrl
        : room.imageUrl ? `${API_URL}${room.imageUrl}` : null;

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">

                {/* COLUMNA ESQUERRA */}
                <div className="flex flex-col gap-6 lg:w-1/2">
                    <div className="relative h-[300px] w-full overflow-hidden rounded-3xl border-2 border-white/20 bg-zinc-900 sm:h-[400px] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        {imageSrc ? (
                            <Image
                                src={imageSrc}
                                alt={room.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-zinc-700">
                                <Info size={64} opacity={0.2} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-md">
                        <h2 className="mb-4 text-xl font-semibold text-white">Sobre aquesta sala</h2>
                        <p className="leading-relaxed text-zinc-400 mb-8">{room.description || "No hi ha cap descripció disponible."}</p>
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <div className="flex items-center gap-3 rounded-2xl bg-zinc-800/40 p-4 border border-white/5">
                                <Users className="text-blue-400" size={24} />
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Capacitat</p>
                                    <p className="text-sm font-semibold text-zinc-200">{room.capacity} persones</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-zinc-800/40 p-4 border border-white/5">
                                <CheckCircle2 className="text-green-400" size={24} />
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Estat</p>
                                    <p className="text-sm font-semibold text-green-400">Lliure ara</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DRETA */}
                <div className="flex flex-col lg:w-1/2">
                    <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">{room.name}</h1>

                            <div className="mb-8 space-y-4 border-y border-white/5 py-6">
                                <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Equipament inclòs</h3>
                                <div className="flex flex-wrap gap-3">
                                    {room.hasTv || room.hasProjector || room.hasWhiteboard || room.hasAirConditioning ? (
                                        <>
                                            {room.hasTv && <Badge icon={<Tv size={14} />} text="Smart TV" />}
                                            {room.hasProjector && <Badge icon={<Projector size={14} />} text="Projector" />}
                                            {room.hasWhiteboard && <Badge icon={<PenTool size={14} />} text="Pissarra" />}
                                            {room.hasAirConditioning && <Badge icon={<Wind size={14} />} text="Climatitzada" />}
                                        </>
                                    ) : (
                                        <span className="text-sm italic text-zinc-600 ml-1">Sense equipament addicional.</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6 rounded-3xl border border-white/5 bg-zinc-900/30 p-6">
                                <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <CalendarDays size={18} className="text-blue-400" /> Fes una reserva
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1 ml-1 font-medium">DATA</label>
                                            <input type="date" className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-zinc-200 outline-none focus:border-blue-500/50 [color-scheme:dark]" value={reservaDate} onChange={(e) => setReservaDate(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1 ml-1 font-medium">INICI</label>
                                            <div className="relative">
                                                <input type="time" className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 pl-10 text-zinc-200 outline-none focus:border-blue-500/50 [color-scheme:dark]" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1 ml-1 font-medium">FI</label>
                                            <div className="relative">
                                                <input type="time" className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 pl-10 text-zinc-200 outline-none focus:border-blue-500/50 [color-scheme:dark]" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* CERCADOR D'ASSISTENTS */}
                                    <div className="space-y-3 pt-2" ref={dropdownRef}>
                                        <label className="block text-xs text-zinc-500 ml-1 font-medium flex items-center gap-2 uppercase tracking-widest">
                                            <UserPlus size={14} className="text-blue-400" /> Afegeix assistents
                                        </label>

                                        {selectedGuestObjects.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {selectedGuestObjects.map(user => (
                                                    <span key={user.id} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] rounded-full">
                                                        {user.name}
                                                        <button onClick={() => toggleGuest(user.id)} className="hover:text-white transition-colors">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cerca pel nom o correu..."
                                                    className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 pl-10 text-sm text-zinc-200 outline-none focus:border-blue-500/50 transition-all"
                                                    value={searchQuery}
                                                    onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                                                    onFocus={() => setIsDropdownOpen(true)}
                                                />
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            </div>

                                            {isDropdownOpen && searchQuery.length > 0 && (
                                                <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
                                                    {filteredUsers.length > 0 ? (
                                                        filteredUsers.map(user => (
                                                            <button
                                                                key={user.id}
                                                                onClick={() => { toggleGuest(user.id); setSearchQuery(''); setIsDropdownOpen(false); }}
                                                                className="flex w-full items-center justify-between px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 border-b border-white/5 last:border-0"
                                                            >
                                                                <div className="flex flex-col items-start italic">
                                                                    <span className="font-medium not-italic">{user.name}</span>
                                                                    <span className="text-[10px] text-zinc-500">{user.email}</span>
                                                                </div>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-xs text-zinc-500 italic">No s&apos;ha trobat cap coincidència</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="mt-8 w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/10 enabled:hover:bg-blue-600 disabled:opacity-50"
                            disabled={!reservaDate || !startTime || !endTime}
                            onClick={handleReserva}
                        >
                            Confirmar reserva
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-12 flex justify-center"><BackButton previouspage="/dashboard/employee" /></div>
        </div>
    );
};

const Badge = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300">
        {icon} {text}
    </div>
);

export default DetallReservaPage;