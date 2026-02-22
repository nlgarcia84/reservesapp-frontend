import { Card } from '@/components/ui/Card';
import { getRooms } from '@/app/services/rooms';

const AdminPage = async () => {
  const rooms = await getRooms();
  return (
    <>
      <Card
        title="Sales disponibles"
        subtitle="Llistat de totes les sales del sistema"
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-emerald-950 m-2 rounded-2xl p-4 flex flex-row justify-between"
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
