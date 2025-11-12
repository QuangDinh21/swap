import React, { useState } from 'react';
import { cn } from '../../utils/common';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  label,
  error,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full p-4 bg-white border-2 border-slate-200 rounded-xl text-left hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error &&
              'border-red-300 focus:border-red-400 focus:ring-red-500/20',
            disabled && 'opacity-50 cursor-not-allowed',
            isOpen && 'border-blue-500'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedOption ? (
                <>
                  {selectedOption.icon && (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      {selectedOption.icon}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">
                      {selectedOption.label}
                    </div>
                    {selectedOption.description && (
                      <div className="text-sm text-slate-500">
                        {selectedOption.description}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {placeholder}
                    </div>
                    <div className="text-sm text-slate-500">
                      Choose from {options.length} options
                    </div>
                  </div>
                </>
              )}
            </div>
            <svg
              className={cn(
                'w-5 h-5 text-slate-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full p-4 text-left hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  value === option.value && 'bg-blue-50'
                )}
              >
                <div className="flex items-center space-x-3">
                  {option.icon && (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      {option.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-slate-500">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {value === option.value && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
