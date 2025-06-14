import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

export function Button({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all';
  
  const variantStyles = {
    default: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    outline: 'border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10',
    ghost: 'text-cyan-500 hover:bg-cyan-500/10',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}