import { Trash } from 'lucide-react';
import { deleteUser } from '@/app/services/users';
import { deleteRoom } from '@/app/services/rooms';
import { useAuth } from '@/app/hooks/useAuth';

type DeleteButtonProps = {
  codi: number;
  type?: 'user' | 'room';
  onDeleted?: () => void;
};

export const DeleteButton = ({
  codi,
  type = 'user',
  onDeleted,
}: DeleteButtonProps) => {
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!token) return;
    try {
      if (type === 'room') {
        await deleteRoom(codi, token);
      } else {
        await deleteUser(codi, token);
      }
      onDeleted?.();
    } catch (err) {
      console.error(`Error eliminant ${type}:`, err);
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
