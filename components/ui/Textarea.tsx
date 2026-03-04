import React from 'react';

interface TextareaProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Textarea({
  label,
  error,
  placeholder,
  value,
  onChange,
  rows = 4,
  className = '',
  required = false,
  disabled = false,
}: TextareaProps) {
  const textareaId = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`
          w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900
          placeholder:text-gray-400
          transition-colors duration-150 resize-y
          focus:outline-none focus:ring-2 focus:ring-[#4884B8]/20 focus:border-[#4884B8]
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}
        `}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
