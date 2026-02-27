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

const AdminPage = async () => {
  const rooms = await getRooms();
  const total = rooms.reduce((acc, producto) => acc + producto.capacity, 0);
  return (
    <>
      <div className="md:w-2xl lg:w-3xl xl:w-5xl">
        {/* Aqui el texto bienvenida */}
        <div className="mb-5 p-5">
          <div className="flex flex-row">
            <h1 className="text-3xl font-bold mb-2 mr-5">Bon dia, Admin</h1>
            <Hand />
          </div>

          <h2 className="text-xl font-extralight">
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
                  className="bg-emerald-950 m-1 rounded-2xl p-4 mb-2 flex flex-row justify-between"
                >
                  <p className="font-semibold">{room.name}</p>

                  <p className="text-sm text-slate-400">
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
