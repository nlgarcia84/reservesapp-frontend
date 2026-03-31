'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { getRooms } from '@/app/services/rooms';
import {
  Hand,
  UsersRound,
  Hotel,
  SearchCheck,
  Clipboard,
  Clock,
  CalendarClock,
} from 'lucide-react';

type Room = { id: number; name: string; capacity: number };

const AdminPage = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);

    if (!token) {
      // Durante logout, mantener loading sin mostrar error
      // El logout redirigirá a /login antes de que se vea aquí
      return;
    }

    const fetchRooms = async () => {
      try {
        setError('');
        const data = await getRooms(token);
        setRooms(data);
        setTotal(data.reduce((acc, room) => acc + room.capacity, 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error carregant sales');
        setRooms([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [token]);

  if (loading) return <div>Carregant...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return (
    <>
      <div className="md:w-2xl lg:w-3xl xl:w-5xl">
        {/* Aqui el texto bienvenida */}
        <div className="mb-5 p-2 sm:p-4">
          <div className="flex flex-row">
            <h1 className="mb-2 mr-3 text-3xl font-bold tracking-tight">
              Bon dia, Admin
            </h1>
            <Hand className="text-blue-400" />
          </div>

          <h2 className="text-base text-zinc-400 sm:text-lg font-light">
            Aqui tens un resum de les teves sales i reserves.
          </h2>
        </div>

        {/* Aqui tarjetas de salas */}
        <div className="xl:flex xl:justify-center gap-4">
          <div>
            <div className="justify-between text-center md:grid md:grid-cols-2 md:gap-4 xl:gap-6">
              <Card title="Total Sales" icon={Hotel}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{rooms.length}</span>
                  <span>Sales registrades</span>
                </div>
              </Card>
              <Card title="Capacitat Total" icon={UsersRound}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{total}</span>
                  <span>Places disponibles</span>
                </div>
              </Card>
            </div>
            <Card
              title="Sales disponibles"
              subtitle="Llistat de totes les sales del sistema"
              icon={SearchCheck}
            >
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="m-1 mb-2 flex flex-row justify-between rounded-xl border border-white/10 bg-zinc-900/70 p-3"
                >
                  <p className="font-semibold text-zinc-100">{room.name}</p>

                  <p className="text-sm text-zinc-400">
                    {room.capacity} places
                  </p>
                </div>
              ))}
            </Card>
          </div>

          {/* Aqui targetas de reservas */}
          <div className="justify-between text-center md:grid md:grid-cols-2 gap-4">
            <div className="xl:grid xl:grid-col-2">
              <Card title="Reserves Totals" icon={Clipboard}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{0}</span>
                  <span>Reserves</span>
                </div>
              </Card>

              <Card title="Reserves Avui" icon={Clock}>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{0}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </Card>
            </div>

            <Card
              title="Reserves recents"
              icon={CalendarClock}
              subtitle="Últimes reserves realitzades"
            >
              No hi ha reserves registrades
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
