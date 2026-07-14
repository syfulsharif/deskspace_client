import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  id: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement> & {
  type?: string;
};

export function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 ${
          error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-zinc-200 focus:border-amber-500'
        }`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  error,
  helperText,
  id,
  className = '',
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 ${
          error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-zinc-200 focus:border-amber-500'
        }`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

type SelectProps = BaseInputProps & SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
};

export function Select({
  label,
  error,
  helperText,
  id,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 ${
          error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-zinc-200 focus:border-amber-500'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
