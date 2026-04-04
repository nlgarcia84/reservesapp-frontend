import Link from 'next/link';
import { SquareChevronLeft } from 'lucide-react';

type BackButtonProps = {
  previouspage: string;
};

export const BackButton = ({ previouspage }: BackButtonProps) => {
  return (
    <>
      <Link href={previouspage}>
        <div className="flex flex-row justify-center text-blue-500 font-semibold hover:text-blue-400 cursor-pointer">
          <SquareChevronLeft />
          <span className="pl-2">Tornar</span>
        </div>
      </Link>
    </>
  );
};
