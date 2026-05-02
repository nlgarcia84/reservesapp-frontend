import { SquareChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type BackButtonProps = {
  text: string;
  previouspage?: string;
  conditionalNav?: () => void;
};

export const BackButton = ({
  text,
  previouspage,
  conditionalNav,
}: BackButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    // 1. Si el usuario pasó una función lógica, la ejecutamos
    if (conditionalNav) {
      conditionalNav();
    }
    // 2. Si no hay función pero hay una ruta fija, vamos a ella
    else if (previouspage) {
      router.push(previouspage);
    }
    // 3. Fallback: si no hay nada, simplemente volver atrás en el historial
    else {
      router.back();
    }
  };

  return (
    <>
      <button
        onClick={handlePress}
        className="flex flex-row items-center justify-center text-blue-500 font-semibold hover:text-blue-400 cursor-pointer bg-transparent border-none outline-none"
      >
        <SquareChevronLeft />
        <span className="pl-2">{text}</span>
      </button>
    </>
  );
};
