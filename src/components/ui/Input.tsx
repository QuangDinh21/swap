import React from 'react';
import { cn } from '../../utils/common';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftAddon,
  rightAddon,
  containerClassName,
  className,
  type,
  onKeyDown,
  ...props
}: InputProps) {
  // Handle key down to prevent negative numbers for number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      // Prevent minus sign, plus sign, and 'e' (exponential notation)
      if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    }

    // Call the original onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="input-group">
        {leftAddon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-slate-500">
            {leftAddon}
          </div>
        )}

        <input
          className={cn(
            'input-field',
            leftAddon && 'pl-12',
            rightAddon && 'pr-36',
            error &&
              'border-red-300 focus:border-red-400 focus:ring-red-500/20',
            className
          )}
          type={type}
          onKeyDown={handleKeyDown}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' ? 'any' : undefined}
          {...props}
        />

        {rightAddon && <div className="input-addon">{rightAddon}</div>}
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
