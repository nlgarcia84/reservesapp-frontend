type InputSelectFormProps = {
  id: string;
  name: string;
  value: string;
  label: string;
};

export const InputSelectForm = ({
  id,
  name,
  value,
  label,
}: InputSelectFormProps) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-black px-3 py-3 hover:border-white/25 transition-colors">
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        className="w-4 h-4 rounded border-white/15 bg-zinc-800 cursor-pointer accent-blue-500"
      />
      <label htmlFor={id} className="text-zinc-100 cursor-pointer flex-1">
        {label}
      </label>
    </div>
  );
};
