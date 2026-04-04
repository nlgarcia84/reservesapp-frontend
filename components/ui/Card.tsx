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
      <div className=" mb-5 overflow-hidden rounded-2xl border border-white/30 bg-zinc-950/70 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="rounded-t-2xl border-b border-white/10 bg-zinc-900/80 p-3 text-center text-zinc-100">
          <div className="flex flex-row justify-center items-center gap-3">
            <p className="text-lg font-semibold tracking-tight">{title}</p>
            <Icon className="h-5 w-5 text-blue-400" />
          </div>
          {subtitle ? (
            <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
          ) : null}
        </div>
        <div className="p-4 text-zinc-200">{children}</div>
      </div>
    </>
  );
};
