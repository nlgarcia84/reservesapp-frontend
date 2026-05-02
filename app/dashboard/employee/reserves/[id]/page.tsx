'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { getRoomById, type Room } from '@/app/services/rooms';
import {
  createReservation,
  type Reservation,
  getReservationsByRoom,
  updateReservation,
  getMyReservations,
} from '@/app/services/reservation';
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
  Search,
  CalendarRange,
} from 'lucide-react';

interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
}

const DetallReservaPage = () => {
  const { id } = useParams(); 
  const { token, userId, role } = useAuth(); // Afegim rol per gestionar permisos i redireccions
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [room, setRoom] = useState<Room | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [roomReservations, setRoomReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [reservaDate, setReservaDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdFromUrl = searchParams.get('editReservationId');

  const [editingId, setEditingId] = useState<number | null>(null);

  // Autorització d'accés: permetem que Admin i Employee vegin la pàgina
  useEffect(() => {
    if (role && role !== 'EMPLOYEE' && role !== 'ADMIN') {
      router.push('/dashboard'); // Redirigim si el rol no és apte
    }
  }, [role, router]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 22; hour++) {
      if (hour === 22) {
        options.push('22:00');
        break;
      }
      for (let min = 0; min < 60; min += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const fetchData = useCallback(async () => {
    if (!token || !id) return;
    try {
      setIsLoading(true);
      const [roomData, usersData] = await Promise.all([
        getRoomById(id as string, token),
        getUsers(token),
      ]);

      setRoom(roomData);
      setAllUsers(
        usersData.filter((u: User) => u.id.toString() !== userId?.toString()),
      );

      try {
        const reservationsData = await getReservationsByRoom(Number(id), token);
        setRoomReservations(reservationsData);
      } catch (agendaError) {
        setRoomReservations([]);
      }
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
    if (editIdFromUrl && roomReservations.length > 0) {
      const idParaEditar = Number(editIdFromUrl);
      const resToEdit = roomReservations.find(
        (r) => Number(r.id) === idParaEditar,
      );

      if (resToEdit) {
        console.log('Modo edición activado para ID:', resToEdit.id);
        setEditingId(Number(resToEdit.id));
        setReservaDate(resToEdit.date);
        setStartTime(resToEdit.startTime);
        setEndTime(resToEdit.endTime);

        if (resToEdit.guests && Array.isArray(resToEdit.guests)) {
          // Definimos g como number o string para que el .toString() sea válido
          setSelectedGuests(
            resToEdit.guests.map((g: number | string) => g.toString()),
          );
        }
      }
    }
  }, [editIdFromUrl, roomReservations]);

  const resetForm = () => {
    setEditingId(null);
    setReservaDate('');
    setStartTime('');
    setEndTime('');
    setSelectedGuests([]);
    router.replace(`/dashboard/employee/reserves/${id}`);
  };

  const handleReserva = async () => {
    const creatorId = userId || localStorage.getItem('userId');
    // Usamos el ID de la URL como fuente de verdad absoluta
    const editReservationId = searchParams.get('editReservationId');

    if (!token || !id || !creatorId) return;

    interface ReservationPayload {
      id?: number; // Opcional para creación, obligatorio para edición
      room_id: number;
      user_id: number;
      date: string;
      start_time: string;
      end_time: string;
      guests: number[];
    }

    // Creamos el objeto siguiendo la interfaz
    const reservationData: ReservationPayload = {
      room_id: Number(id),
      user_id: Number(creatorId),
      date: reservaDate,
      start_time: startTime,
      end_time: endTime,
      guests: [...new Set([Number(creatorId), ...selectedGuests.map(Number)])],
    };

    try {
      if (editReservationId) {
        // Modo edición
        const idParaActualizar = Number(editReservationId);

        // Añadimos el ID al objeto 
        reservationData.id = idParaActualizar;

        console.log('Actualizando reserva existente:', idParaActualizar);
        await updateReservation(idParaActualizar, reservationData, token);
        alert('Reserva actualitzada correctament!');
      } else {
        // Modo creación
        console.log('Creando nueva reserva...');
        await createReservation(reservationData, token);
        alert('Reserva realitzada correctament!');
      }

      // Redirecció segons el rol de l'usuari (Admin torna al panell global, Empleat a la seva agenda)
      if (role === 'ADMIN') {
        router.push('/dashboard/admin/gestio-reserves');
      } else {
        router.push('/dashboard/employee/les-meves-reserves');
      }
      router.refresh();
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error al processar la reserva');
    }
  };

  const toggleGuest = (guestId: string) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId],
    );
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedGuests.includes(user.id.toString()),
  );

  const selectedGuestObjects = allUsers.filter((u) =>
    selectedGuests.includes(u.id.toString()),
  );

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (!room)
    return (
      <div className="text-center p-10 text-zinc-400">
        No s&apos;ha trobat la sala.
      </div>
    );

  const hasEquipment =
    room.hasTv ||
    room.hasProjector ||
    room.hasWhiteboard ||
    room.hasAirConditioning;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const imageSrc = room.imageUrl?.startsWith('http')
    ? room.imageUrl
    : room.imageUrl
      ? `${API_URL}${room.imageUrl}`
      : null;

  const handleConditionalNavigation = async () => {
    if (!token || isLoading) return; // Si ya está cargando, no hacer nada

    // Lògica per a Administradors: Tornar directament a la gestió global
    if (role === 'ADMIN') {
      router.push('/dashboard/admin/gestio-reserves');
      return;
    }

    try {
      setIsLoading(true); // Esto debería mostrar un spinner o deshabilitar el botón
      const reserves = await getMyReservations(token);
      console.log(reserves);
      
      // Comprobación clara
      if (reserves && reserves.length > 0) {
        // Tiene reservas -> Ir a su lista personal
        router.push('/dashboard/employee/les-meves-reserves');
      } else {
        // No tiene -> Volver al buscador o panel de inicio
        router.push('/dashboard/employee');
      }
    } catch (error) {
      console.error('Error al comprobar reservas:', error);
      // IMPORTANTE: Si falla la API, lo mejor es enviarlo a la raíz del dashboard
      // para que no se quede atrapado en una página de error.
      router.push('/dashboard/employee');
    } finally {
      // Es vital apagar el loading, aunque router.push ya cambie la página
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-0 py-0">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
          {room.name}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visual de la sala */}
        <div className="relative h-[380px] w-full overflow-hidden rounded-3xl border-2 border-white/10 bg-zinc-900 shadow-2xl">
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

        {/* Detalles */}
        <div className="h-[380px] rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-md flex flex-col">
          <h2 className="mb-4 text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-2">
            <Info size={20} className="text-blue-400" /> Detalls de la sala
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 mb-6 italic">
            &quot;{room.description || 'Sense descripció.'}&quot;
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-950/50 p-4 border border-white/5">
              <Users className="text-blue-400" size={24} />
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">
                  Capacitat
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  {room.capacity} persones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-950/50 p-4 border border-white/5">
              <CheckCircle2 className="text-green-400" size={24} />
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">
                  Estat
                </p>
                <p className="text-sm font-semibold text-green-400">
                  Operativa
                </p>
              </div>
            </div>
          </div>

          {hasEquipment && (
            <div className="mt-2">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                Equipament disponible
              </p>
              <div className="flex flex-wrap gap-3">
                {room.hasTv && (
                  <Badge icon={<Tv size={18} />} text="Smart TV" />
                )}
                {room.hasProjector && (
                  <Badge icon={<Projector size={18} />} text="Projector" />
                )}
                {room.hasWhiteboard && (
                  <Badge icon={<PenTool size={18} />} text="Pissarra" />
                )}
                {room.hasAirConditioning && (
                  <Badge icon={<Wind size={18} />} text="AC" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="min-h-[480px] rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl flex flex-col">
          <h2 className="mb-6 text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-2">
            <CalendarDays size={20} className="text-blue-400" />
            {editingId ? 'Editar Reserva' : 'Fes una reserva'}
          </h2>

          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1 ml-1 font-bold uppercase tracking-widest">
                  Data
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-zinc-200 outline-none focus:border-blue-500/50 [color-scheme:dark]"
                  value={reservaDate}
                  onChange={(e) => setReservaDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 ml-1 font-bold uppercase tracking-widest">
                    Hora Inici
                  </label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-zinc-200 outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  >
                    <option value="">Tria...</option>
                    {timeOptions.map((t) => (
                      <option key={`start-${t}`} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 ml-1 font-bold uppercase tracking-widest">
                    Hora Fi
                  </label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-zinc-200 outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    <option value="">Tria...</option>
                    {timeOptions.map((t) => (
                      <option key={`end-${t}`} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2" ref={dropdownRef}>
                <label className="block text-[10px] text-zinc-500 ml-1 font-bold flex items-center gap-2 uppercase tracking-widest">
                  <UserPlus size={14} className="text-blue-400" /> Assistents
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cerca companys..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 pl-10 text-sm text-zinc-200 outline-none focus:border-blue-500/50"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  {isDropdownOpen && searchQuery.length > 0 && (
                    <div className="absolute z-50 mt-2 w-full max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              toggleGuest(user.id.toString());
                              setSearchQuery('');
                              setIsDropdownOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 border-b border-white/5 last:border-0 text-left"
                          >
                            <div>
                              <span className="block font-medium">
                                {user.name}
                              </span>
                              <span className="text-[9px] text-zinc-500 italic">
                                {user.email}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-[10px] text-zinc-500 italic">
                          Cap resultat
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedGuestObjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedGuestObjects.map((user) => (
                      <span
                        key={user.id}
                        className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] rounded-full"
                      >
                        {user.name}
                        <button
                          onClick={() => toggleGuest(user.id.toString())}
                          className="hover:text-white"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {editingId && (
              <Button
                className="mt-8 flex-1 py-4 text-md font-bold"
                onClick={resetForm}
              >
                Cancel·lar
              </Button>
            )}
            <Button
              className="mt-8 flex-[2] py-4 text-md font-bold shadow-lg shadow-blue-500/10"
              onClick={handleReserva}
            >
              {editingId ? 'Actualitzar Reserva' : 'Confirmar Reserva'}
            </Button>
          </div>
        </div>

        {/* Agenda */}
        <div className="min-h-[480px] rounded-3xl border border-white/10 bg-zinc-900/20 p-8 flex flex-col">
          <h2 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-2 mb-6">
            <CalendarRange size={20} className="text-blue-400" /> Agenda de la
            sala
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
            {roomReservations.length > 0 ? (
              roomReservations.map((res) => (
                <div
                  key={res.id}
                  className="rounded-2xl border border-white/5 bg-zinc-950/40 p-4 flex items-center justify-between hover:bg-zinc-900/60 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                      {new Date(res.date).toLocaleDateString('ca-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <div className="text-[11px] font-medium text-zinc-200 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="font-bold">
                        {res.startTime} - {res.endTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <Clock size={12} className="text-blue-400" />
                    <span className="text-[10px] font-bold">
                      {res.startTime}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-center opacity-40">
                <p className="text-xs">No hi ha reserves programades.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <BackButton conditionalNav={handleConditionalNavigation} />
      </div>
    </div>
  );
};

const Badge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-950/70 px-4 py-2.5 text-sm font-bold text-zinc-200 uppercase tracking-tight">
    {icon} {text}
  </div>
);

export default DetallReservaPage;