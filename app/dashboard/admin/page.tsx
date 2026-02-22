import { Card } from '@/components/ui/Card';
import { getRooms } from '@/app/services/rooms';

const AdminPage = async () => {
  const rooms = await getRooms();
  const total = rooms.reduce((acc, producto) => acc + producto.capacity, 0);
  return (
    <>
      <div className="mb-5">
        <h1 className="text-3xl font-bold mb-2">Bon dia, Admin</h1>
        <h2 className="text-xl font-extralight">
          Aqui tens un resum de les teves sales i reserves.
        </h2>
      </div>

      <div className="flex flex-row justify-between text-center">
        <Card title="Total Sales">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{rooms.length}</span>
            <span>Sales registrades</span>
          </div>
        </Card>

        <Card title="Capacitat Total">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{total}</span>
            <span>Places disponibles</span>
          </div>
        </Card>
      </div>

      <Card
        title="Sales disponibles"
        subtitle="Llistat de totes les sales del sistema"
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-emerald-950 m-1 rounded-2xl p-4 mb-2 flex flex-row justify-between"
          >
            <p className="font-semibold">{room.name}</p>
            <p className="text-sm text-slate-400">{room.capacity} places</p>
          </div>
        ))}
      </Card>

      <Card title="Reserves recents" subtitle="Últimes reserves realitzades">
        No hi ha reserves registrades
      </Card>
    </>
  );
};

export default AdminPage;
