import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

type CardProps = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: ReactNode;
};

export const Card = ({ title, subtitle, icon: Icon, children }: CardProps) => {
  return (
    <>
      <div className="border border-emerald-400 rounded-2xl mb-5">
        <div className=" bg-emerald-400 text-black rounded-t-2xl p-2 text-center">
          <div className="flex flex-row justify-center">
            <p className="text-xl font-bold pr-8">{title}</p>
            <Icon className="w-6 h-6 text-black" />
          </div>
          <p>{subtitle}</p>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
};
