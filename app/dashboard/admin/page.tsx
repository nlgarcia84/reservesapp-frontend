'use client';

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
} from 'lucide-react';

const AdminPage = () => {
  const { token } = useAuth();
  const { greeting, icon } = useTimeGreeting();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 1. EFECTOS ---
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
    const avui = new Date();
    const offset = avui.getTimezoneOffset() * 60000;
    const avuiString = new Date(avui.getTime() - offset)
      .toISOString()
      .split('T')[0];
    return reservation.filter((r) => r.date === avuiString);
  }, [reservation]);

  const { mensajeReservesAvui, mensajeColorAvui } = useMemo(() => {
    const count = reservesAvui.length;

    if (count === 0)
      return {
        mensajeReservesAvui: 'No tens reserves avui',
        mensajeColorAvui: 'text-zinc-500', // Gris si no hay nada
      };

    return {
      mensajeReserves:
        count === 1
          ? `Tens ${count} reserva avui`
          : `Tens ${count} reserves avui`,
      mensajeColor: 'text-blue-400', // Azul si hay reservas
    };
  }, [reservesAvui.length]);

  const reservesProximas = useMemo(() => {
    // 1. Obtenemos la fecha de HOY a las 00:00:00 local
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // 2. Fecha límite (dentro de 8 días para asegurar el rango completo)
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

  const { mensajeReservesProximes, mensajeColorProximes } = useMemo(() => {
    const count = reservesAvui.length;

    if (count === 0)
      return {
        mensajeReservesProximes: 'No tens pròximes reserves',
        mensajeColorProximes: 'text-zinc-500', // Gris si no hay nada
      };

    return {
      mensajeReserves:
        count === 1
          ? `Tens ${count} reserva pròximament`
          : `Tens ${count} reserves pròximament`,
      mensajeColor: 'text-blue-400', // Azul si hay reservas
    };
  }, [reservesAvui.length]);
  // --- 3. RENDERS CONDICIONALES ---
  if (loading)
    return <div className="p-10 text-zinc-400">Carregant dashboard...</div>;
  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  // --- 4. RENDER PRINCIPAL ---
  return (
    <>
      <div className="md:w-2xl lg:w-3xl xl:w-5xl">
        <div className="mb-5 p-2 sm:p-4">
          <div className="flex flex-row">
            <h1 className="mb-2 mr-3 text-3xl font-bold tracking-tight">
              {icon}
              {greeting}, Admin
            </h1>
            <Hand className="text-blue-400" />
          </div>

          <h2 className="text-base text-zinc-400 sm:text-lg font-light">
            Aqui tens el catàleg de sales y les reserves
          </h2>
        </div>

        <div className="xl:flex xl:justify-center gap-4">
          <div>
            <div className="justify-between text-center md:grid md:grid-cols-2 md:gap-4 xl:gap-6">
              <Card title="Total Sales" icon={Hotel}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-400">
                    {rooms.length}
                  </span>
                  <span>Sales registrades</span>
                </div>
              </Card>
              <Card title="Capacitat Total" icon={UsersRound}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-400">
                    {total}
                  </span>
                  <span>Places disponibles</span>
                </div>
              </Card>
            </div>
            <Card
              title="Cataleg de sales"
              subtitle="Llistat de totes les modalitats de sales"
              icon={SearchCheck}
            >
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="m-1 mb-2 flex flex-row justify-between rounded-xl border border-white/10 bg-zinc-900/70 p-3"
                >
                  <p className="font-medium text-zinc-100">{room.name}</p>
                  <p className="text-sm text-blue-400 font-medium">
                    {room.capacity} places
                  </p>
                </div>
              ))}
            </Card>
          </div>

          <div className="justify-between text-center md:grid md:grid-cols-2 gap-4">
            <div className="xl:grid xl:grid-col-2">
              <Card title="Reserves Totals" icon={Clipboard}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-400">
                    {reservation.length}
                  </span>
                  <span>Reserves</span>
                </div>
              </Card>

              <Card title="Reserves Avui" icon={Clock}>
                <div className="flex flex-col">
                  <span className={`text-lg font-bold ${mensajeColorAvui}`}>
                    {mensajeReservesAvui}
                  </span>
                  <span className="text-xs text-zinc-500 mb-5">
                    {new Date().toLocaleDateString()}
                  </span>
                  <div className="space-y-2">
                    {reservesAvui.slice(0, 5).map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between text-left p-2 rounded-lg bg-zinc-900/50 border border-white/5"
                      >
                        <div>
                          <p className="text-[10px] font-bold text-blue-400 uppercase">
                            {new Date(r.date).toLocaleDateString('ca-ES', {
                              weekday: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-xs">Sala {r.roomId}</p>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {r.startTime} - {r.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <Card
              title="Previsió 7 dies"
              icon={CalendarClock}
              subtitle="Properes reserves programades"
            >
              <div></div>
              <span
                className={`text-lg font-bold text-blue-400 ${mensajeColorProximes}`}
              >
                {mensajeReservesProximes}
              </span>
              {reservesProximas.length > 0 ? (
                <div className="space-y-2 mt-5">
                  {reservesProximas.slice(0, 5).map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between text-left p-2 rounded-lg bg-zinc-900/50 border border-white/5"
                    >
                      <div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase">
                          {new Date(r.date).toLocaleDateString('ca-ES', {
                            weekday: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs">Sala {r.roomId}</p>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {r.startTime} - {r.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-4">
                  No hi ha reserves programades
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
