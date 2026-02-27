import { AddRoomForm } from '@/components/admin/AddRoomForm';
import { DeleteRoomForm } from '@/components/admin/DeleteRoomForm';

const GestioSales = () => {
  return (
    <>
      <div className="p-5">
        <h1 className="text-3xl mb-10 border-2 border-emerald-800 rounded-2xl p-7 text-center">
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
