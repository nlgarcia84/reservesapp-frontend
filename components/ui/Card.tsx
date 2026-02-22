import { ReactNode } from 'react';

type CardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const Card = ({ title, subtitle, children }: CardProps) => {
  return (
    <>
      <div className="border border-emerald-400 rounded-2xl mb-5">
        <div className=" bg-emerald-400 text-black rounded-t-2xl p-2 text-center">
          <p className="text-xl font-bold">{title}</p>
          <p>{subtitle}</p>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
};
