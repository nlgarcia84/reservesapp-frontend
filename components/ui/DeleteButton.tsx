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
    // Creem el text de forma dinàmica segons el 'type'
    const textEntitat = type === 'room' ? 'la sala' : "l'usuari";
    
    // Utilitzem el textEntitat i el name per fer la pregunta
    const resultado: boolean = confirm(
      `Estàs segur que vols eliminar ${textEntitat} "${name}"?`
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
        alert(`Hi ha hagut un error intentant eliminar ${textEntitat}.`);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1 hover:text-red-400 transition cursor-pointer"
      // Aprofitem per posar un tooltip dinàmic quan passes el ratolí per sobre
      title={`Eliminar ${type === 'room' ? 'sala' : 'usuari'}`} 
    >
      <Trash size={18} />
    </button>
  );
};