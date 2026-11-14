import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

// კლასები სრულად წერია, რომ Tailwind-მა ისინი ამოიცნოს
const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  outline: 'border border-line bg-white text-primary hover:bg-hero',
};

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`h-11 rounded-lg px-4 text-sm font-medium transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  );
}
