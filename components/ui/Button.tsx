import React from 'react';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', asChild = false, ...props }, ref) => {
    const classes = `mb-4 block w-full rounded-lg border border-zinc-200 bg-white p-3 text-base font-medium text-black transition-all duration-150 hover:bg-zinc-100 active:scale-95 active:shadow-inner cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${className}`;

    if (asChild) {
      return <>{props.children}</>;
    }

    return <button ref={ref} className={classes} {...props} />;
  },
);

Button.displayName = 'Button';
