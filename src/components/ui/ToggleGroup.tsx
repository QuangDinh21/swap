import React from 'react';
import { cn } from '../../utils/common';

export interface ToggleOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ToggleGroup({
  options,
  value,
  onValueChange,
  label,
  className,
}: ToggleGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className={`grid grid-cols-2 gap-3`}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => !option.disabled && onValueChange(option.value)}
            disabled={option.disabled}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200',
              value === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : option.disabled
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            )}
          >
            <div className="flex flex-col items-center space-y-2">
              {option.icon && (
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    value === option.value
                      ? 'bg-blue-500 text-white'
                      : option.disabled
                      ? 'bg-slate-100 text-slate-400'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {option.icon}
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold text-sm">{option.label}</div>
                {option.description && (
                  <div className="text-xs opacity-75">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
