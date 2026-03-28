type ButtonProps = {
  children: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Button = ({
  children,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`mb-4 block w-full rounded-lg border border-zinc-200 bg-white p-3 text-base font-medium text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {children}
    </button>
  );
};
