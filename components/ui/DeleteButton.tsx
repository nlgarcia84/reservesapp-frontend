import { Trash } from 'lucide-react';
import { deleteUser } from '@/app/services/users';
import { deleteRoom } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';

type DeleteButtonProps = {
  codi: number;
  name: string;
  type?: 'user' | 'room';
  onDeleted?: () => void;
};

export const DeleteButton = ({
  codi,
  name,
  type = 'user',
  onDeleted,
}: DeleteButtonProps) => {
  const { token } = useAuth();

  const handleDelete = async () => {
    const resultado: boolean = confirm(
      `¿Estás segur que vols eliminar l'usuari?`,
    );
    if (resultado) {
      if (!token) return;
      try {
        if (type === 'room') {
          await deleteRoom(codi, token);
          alert(`La sala ${name} ha sigut eliminada!`);
        } else {
          await deleteUser(codi, name, token);
          alert(`L'usuari ${name} ha sigut eliminat!`);
        }
        onDeleted?.();
      } catch (err) {
        console.error(`Error eliminant ${type}:`, err);
      }
    } else {
      return;
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1 hover:text-red-400 transition cursor-pointer"
    >
      <Trash size={18} />
    </button>
  );
};
