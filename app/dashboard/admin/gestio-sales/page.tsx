import { AddRoomForm } from '@/components/admin/AddRoomForm';
import { DeleteRoomForm } from '@/components/admin/DeleteRoomForm';

const GestioSales = () => {
  return (
    <>
      <div className="p-5">
        <h1 className="mb-10 rounded-2xl border border-white/10 bg-zinc-950/70 p-7 text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Panell administrador de gestió de sales
        </h1>
        <div className="text-center mb-2">
          <AddRoomForm />
          <DeleteRoomForm />
        </div>
      </div>
    </>
  );
};

export default GestioSales;
