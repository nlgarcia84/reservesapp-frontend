type InputFormProps = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export const InputForm = ({
  type,
  placeholder,
  value,
  onChange,
  required,
}: InputFormProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full rounded-lg border border-white/15 bg-black px-3 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};
