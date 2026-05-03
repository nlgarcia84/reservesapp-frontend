'use client';

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { getRooms, type Room } from '@/app/services/rooms';
import { useTimeGreeting } from '@/app/hooks/useTimeGreeting';
import {
  getAllReservations,
  type Reservation,
} from '@/app/services/reservation';

import {
  Hand,
  UsersRound,
  Hotel,
  SearchCheck,
  Clipboard,
  Clock,
  CalendarClock,
  UserCheck,
} from 'lucide-react';

// Utilitats

/**
 * Retorna si una sala està ocupada en aquest moment.
 */
const isRoomOccupiedNow = (roomId: number, allReserves: Reservation[]) => {
  const ahora = new Date();
  const hoyStr = ahora.toISOString().split('T')[0];
  const ahoraEnMinutos = ahora.getHours() * 60 + ahora.getMinutes();

  return allReserves.some((r) => {
    if (Number(r.roomId) !== roomId || r.date !== hoyStr) return false;

    // Llegim l'hora d'inici i de fi de la reserva
    const [hInicio, mInicio] = r.startTime.split(':').map(Number);
    const [hFin, mFin] = r.endTime.split(':').map(Number);

    const inicioTotal = hInicio * 60 + mInicio;
    const finTotal = hFin * 60 + mFin;

    return ahoraEnMinutos >= inicioTotal && ahoraEnMinutos < finTotal;
  });
};

/**
 * Agrupa les reserves per data per construir la vista d'agenda.
 */
const groupReservesByDate = (reserves: Reservation[]) => {
  return reserves.reduce(
    (groups: { [key: string]: Reservation[] }, reserva) => {
      const date = reserva.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(reserva);
      return groups;
    },
    {},
  );
};

const chartConfig = {
  total: {
    label: 'Reserves',
    color: '#3b82f6',
  },
} satisfies ChartConfig;

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error fetch');
  return res.json();
};

// Tipatge per la resposta de l'endpoint /users/online
// Aquest endpoint ha de retornar com a mínim { count: number }
// Opcionalment pot incloure `updatedAt` per mostrar quan es va actualitzar
type OnlineUsersResponse = {
  count: number;
  updatedAt?: string;
};

const AdminPage = () => {
  const { token } = useAuth();
  const { greeting, icon } = useTimeGreeting();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rankingSales = useMemo(() => {
    // Guardem el recompte de reserves per sala
    const counts: Record<number, number> = {};

    reservation.forEach((r) => {
      // Només comptem si la reserva té sala associada
      if (r.roomId) {
        counts[r.roomId] = (counts[r.roomId] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([id, total]) => ({
        // Object.entries retorna les claus com a string
        sala: rooms.find((r) => r.id === Number(id))?.name || `Sala ${id}`,
        total: total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [reservation, rooms]);

  const salesMesConcurrides = useMemo(() => {
    if (rankingSales.length === 0) return new Set<string>();

    const maxReserves = rankingSales[0].total;
    return new Set(
      rankingSales
        .filter((sala) => sala.total === maxReserves)
        .map((sala) => sala.sala),
    );
  }, [rankingSales]);

  const renderBarAmbCalor = (props: {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    payload?: { sala?: string };
  }) => {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const height = Number(props.height ?? 0);
    const nomSala = String(props.payload?.sala ?? '');
    const esSalaTop = salesMesConcurrides.has(nomSala);

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          ry={4}
          fill={esSalaTop ? '#ef4444' : '#3b82f6'}
        />

        {esSalaTop && width > 16 && (
          <g>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={4}
              ry={4}
              fill="url(#burningPulseGradient)"
            >
              <animate
                attributeName="opacity"
                values="0.35;0.8;0.35"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </rect>

            <circle
              cx={x + width - 12}
              cy={y + height / 2}
              r={3}
              fill="#f97316"
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values="2.5;5.5;2.5"
                dur="1.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </g>
    );
  };

  // Refresquem l'hora cada minut per mantenir les dades al dia
  const [now, setNow] = useState(new Date());

  // === Estat del Sistema: consulta en viu ===
  // 1) Només fem la petició si tenim `token` (evita cridar sense auth)
  // 2) `refreshInterval` ha d'estar alineat amb el polling del servidor
  // 3) `keepPreviousData` manté l'últim valor visible mentre es refresca
  // 4) `revalidateOnFocus: false` evita recarregar quan l'usuari torna a la pestanya
  const {
    data: onlineData,
    error: onlineError,
    isLoading: onlineLoading,
  } = useSWR<OnlineUsersResponse>(
    token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/online`, token] : null,
    fetcher,
    {
      refreshInterval: 15000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 8000,
      keepPreviousData: true,
    },
  );

  const onlineCount = onlineData?.count ?? 0;
  const hasOnlineError = Boolean(onlineError);
  const isSystemActive = !hasOnlineError && onlineCount > 0;

  const onlineStatusText = onlineLoading
    ? 'Comprovant estat...'
    : hasOnlineError
      ? 'Estat no disponible'
      : isSystemActive
        ? 'Sistema actiu'
        : 'Sense activitat';

  const onlineBadgeText = hasOnlineError ? 'N/A' : `${onlineCount} ACTIUS`;

  const updatedAtText = onlineData?.updatedAt
    ? new Date(onlineData.updatedAt).toLocaleTimeString('ca-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        setError('');
        const [roomsData, reservesData] = await Promise.all([
          getRooms(token),
          getAllReservations(token),
        ]);
        setRooms(roomsData);
        setTotal(roomsData.reduce((acc, room) => acc + room.capacity, 0));
        setReservation(reservesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error carregant dades');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const reservesAvui = useMemo(() => {
    const avuiString = now.toISOString().split('T')[0];
    return reservation.filter((r) => r.date === avuiString);
  }, [reservation, now]);

  const { mensajeReservesAvui, mensajeColorAvui } = useMemo(() => {
    const count = reservesAvui.length;
    if (count === 0)
      return {
        mensajeReservesAvui: 'No tens reserves avui',
        mensajeColorAvui: 'text-zinc-500',
      };
    return {
      mensajeReservesAvui:
        count === 1
          ? `Tens ${count} reserva avui`
          : `Tens ${count} reserves avui`,
      mensajeColorAvui: 'text-blue-400',
    };
  }, [reservesAvui.length]);

  const reservesProximas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() + 8);

    return reservation
      .filter((r) => {
        const [year, month, day] = r.date.split('-').map(Number);
        const dataReserva = new Date(year, month - 1, day);
        dataReserva.setHours(0, 0, 0, 0);
        return dataReserva > hoy && dataReserva < limite;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [reservation]);

  const groupedProximas = useMemo(
    () => groupReservesByDate(reservesProximas),
    [reservesProximas],
  );

  if (loading)
    return (
      <div className="p-10 text-zinc-400 animate-pulse text-center">
        Carregant dashboard de RoomyApp...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-red-500 bg-red-500/10 rounded-xl m-4">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-6 font-sans">
      {/* Capçalera */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {icon} {greeting}, Admin
            </h1>
            <Hand
              className="text-blue-400 animate-[bounce_3s_infinite]"
              size={28}
            />
          </div>
          <p className="text-zinc-400 font-light mt-1 text-lg">
            Gestiona el catàleg de sales i l&apos;estat de les reserves en temps
            real.
          </p>
        </div>
      </div>

      {/* Contenidor principal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Columna esquerra: mètriques i catàleg */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          {/* Mètriques principals */}
          <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Sales" icon={Hotel}>
              <div className="flex flex-col items-center justify-center py-2">
                <span className="text-4xl font-black text-blue-400 tracking-tighter">
                  {rooms.length}
                </span>
                <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-widest text-center">
                  Sales actives
                </p>
              </div>
            </Card>

            <Card title="Capacitat" icon={UsersRound}>
              <div className="flex flex-col items-center justify-center py-2">
                <span className="text-4xl font-black text-blue-400 tracking-tighter">
                  {total}
                </span>
                <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-widest text-center">
                  Places totals
                </p>
              </div>
            </Card>
          </div>

          <div>
            <Card
              title="Rànquing d'Ús"
              icon={UsersRound}
              subtitle="Sales amb més activitat"
            >
              <div className="h-[300px] w-full pt-4">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={rankingSales}
                      layout="vertical"
                      margin={{ left: 30, right: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="burningPulseGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor="#dc2626"
                            stopOpacity="0.15"
                          />
                          <stop
                            offset="55%"
                            stopColor="#ef4444"
                            stopOpacity="0.5"
                          />
                          <stop
                            offset="100%"
                            stopColor="#f97316"
                            stopOpacity="0.9"
                          />
                        </linearGradient>
                      </defs>

                      {/* Eix X ocult */}
                      <XAxis type="number" hide />

                      {/* Eix Y amb els noms de les sales */}
                      <YAxis
                        dataKey="sala"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        className="text-[10px] font-bold fill-zinc-500 uppercase tracking-tighter"
                        width={100}
                      />

                      {/* Tooltip del gràfic */}
                      <ChartTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={<ChartTooltipContent hideLabel />}
                      />

                      {/* Barres de dades */}
                      <Bar
                        dataKey="total"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                        shape={renderBarAmbCalor}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Peu de targeta amb el total */}
                <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                    Mètrica Històrica
                  </span>
                  <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {reservation.length} RESERVES TOTALS
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <Card
            title="Catàleg de sales"
            icon={SearchCheck}
            subtitle="Disponibilitat en viu"
          >
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-3 mt-4">
              {rooms.map((room) => {
                const occupied = isRoomOccupiedNow(room.id, reservation);
                return (
                  <div
                    key={room.id}
                    className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-3 w-3 items-center justify-center">
                        {occupied && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            occupied
                              ? 'bg-red-500'
                              : 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          }`}
                        ></span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-100 group-hover:text-white transition-colors">
                          {room.name}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${occupied ? 'text-red-400' : 'text-emerald-500'}`}
                        >
                          {occupied ? 'Ocupada ara' : 'Lliure'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-950 px-3 py-1 rounded-lg border border-white/10">
                      <span className="text-xs font-bold text-blue-400">
                        {room.capacity}p
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Columna dreta: reserves i estat del sistema */}
        <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <Card title="Reserves Totals" icon={Clipboard}>
              <div className="flex flex-col items-center justify-center py-2">
                <span className="text-4xl font-black text-blue-400 tracking-tighter">
                  {reservation.length}
                </span>
                <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-widest text-center">
                  Reserves gestionades
                </p>
              </div>
            </Card>

            <Card title="Reserves Avui" icon={Clock}>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-bold text-center py-2 rounded-lg bg-white/5 mb-4 ${mensajeColorAvui}`}
                >
                  {mensajeReservesAvui}
                </span>
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {reservesAvui.length > 0 ? (
                    reservesAvui.map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between items-center p-3 rounded-xl bg-zinc-800/20 border border-white/5"
                      >
                        <span className="text-xs font-bold text-zinc-200">
                          Sala {r.roomId}
                        </span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                          {r.startTime} - {r.endTime}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-zinc-600 text-xs italic py-6">
                      No hi ha activitat programada
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/*
              Targeta "Estat del Sistema"
              Pasos aplicats (documentats):
              1) Mostrar estat de càrrega mentre SWR recupera dades.
              2) Gestionar errors i mostrar 'N/A' quan hi ha problemes.
              3) Mostrar comptador d'usuaris actius i hora `updatedAt` si existeix.
              4) Estils adaptatius per indicar visualment l'estat (pulse/ping).
            */}
            <Card title="Estat del Sistema" icon={UserCheck}>
              <div className="flex flex-col">
                <div
                  className={`text-sm font-bold text-center py-2 rounded-lg bg-white/5 mb-4 ${
                    onlineLoading
                      ? 'text-amber-300'
                      : hasOnlineError
                        ? 'text-orange-400'
                        : isSystemActive
                          ? 'text-emerald-400'
                          : 'text-red-500'
                  }`}
                >
                  {onlineStatusText}
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-800/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          onlineLoading
                            ? 'bg-amber-400 animate-pulse'
                            : hasOnlineError
                              ? 'bg-orange-400 animate-ping'
                              : isSystemActive
                                ? 'bg-emerald-400 animate-ping'
                                : 'bg-red-400 animate-ping'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          onlineLoading
                            ? 'bg-amber-500'
                            : hasOnlineError
                              ? 'bg-orange-500'
                              : isSystemActive
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-200 uppercase">
                        Usuaris en línia
                      </span>
                      {updatedAtText && !hasOnlineError && (
                        <span className="text-[10px] text-zinc-500">
                          Actualitzat a les {updatedAtText}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-3 py-1 rounded border ${
                      onlineLoading
                        ? 'text-amber-300 bg-amber-500/10 border-amber-400/20'
                        : hasOnlineError
                          ? 'text-orange-300 bg-orange-500/10 border-orange-400/20'
                          : isSystemActive
                            ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                            : 'text-red-500 bg-red-500/10 border-red-500/20'
                    }`}
                  >
                    {onlineBadgeText}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Bloc de previsió dels propers 7 dies */}
          <Card
            title="Previsió 7 dies"
            icon={CalendarClock}
            subtitle="Properes reserves"
          >
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedProximas).length > 0 ? (
                Object.entries(groupedProximas).map(([date, items]) => (
                  <div key={date} className="mb-6 last:mb-0">
                    <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md py-1 border-b border-white/5 mb-3">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                        {new Date(date).toLocaleDateString('ca-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.map((r) => (
                        <div
                          key={r.id}
                          className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/40 border border-white/5"
                        >
                          <span className="text-xs font-medium text-zinc-300">
                            Sala {r.roomId}
                          </span>
                          <span className="text-[10px] text-blue-400 font-bold">
                            {r.startTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <CalendarClock
                    className="mx-auto text-zinc-800 mb-3"
                    size={48}
                  />
                  <p className="text-sm text-zinc-600 italic">
                    Sense reserves properes
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
