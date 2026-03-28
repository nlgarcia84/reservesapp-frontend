'use client';

import { useId } from 'react';

interface InterruptorProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Interruptor({ label, checked, onChange }: InterruptorProps) {
  const switchId = useId();

  return (
    <label
      htmlFor={switchId}
      className="inline-flex items-center gap-3 cursor-pointer"
    >
      <input
        type="checkbox"
        id={switchId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-zinc-700 transition-colors duration-700 ease-in-out peer-checked:bg-blue-500 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-zinc-200 after:shadow-sm after:transition-[transform,box-shadow,background-color] after:duration-700 after:ease-in-out peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-checked:after:shadow-md" />
      {label && <span className="text-zinc-200">{label}</span>}
    </label>
  );
}
