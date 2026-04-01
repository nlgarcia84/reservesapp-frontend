type InputFormProps = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
};

export const InputForm = ({
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
}: InputFormProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="block w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-zinc-100 placeholder:text-zinc-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};
