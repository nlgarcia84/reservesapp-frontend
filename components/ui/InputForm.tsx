type InputFormProps = {
  type: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  min?: number;
};

export const InputForm = ({
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  min,
}: InputFormProps) => {
  const baseStyles =
    'block w-full rounded-lg border border-white/15 bg-black px-3 py-3  text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500';

  const conditionalStyles = type === 'number' ? '' : 'pr-11';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      min={min}
      className={`${baseStyles} ${conditionalStyles}`}
    />
  );
};
