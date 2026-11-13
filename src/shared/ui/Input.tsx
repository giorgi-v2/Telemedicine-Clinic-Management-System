import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export default function Input({ id, label, className = '', ...rest }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-muted focus:border-primary ${className}`}
        {...rest}
      />
    </div>
  );
}
