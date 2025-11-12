import React from 'react';
import { cn } from '../../utils/common';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'border-2 border-slate-300/30 border-t-slate-600 rounded-full animate-spin',
        spinnerSizes[size],
        className
      )}
    />
  );
}

export interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function LoadingState({
  title = 'Loading...',
  subtitle,
  icon,
  className
}: LoadingStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto">
          {icon || <LoadingSpinner size="lg" />}
        </div>
      </div>
      <h4 className="text-lg font-semibold text-slate-900 mb-2">{title}</h4>
      {subtitle && <p className="text-slate-600">{subtitle}</p>}
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  subtitle,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto">
          {icon || (
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </div>
      </div>
      <h4 className="text-lg font-semibold text-slate-900 mb-2">{title}</h4>
      {subtitle && <p className="text-slate-600 mb-6 max-w-sm mx-auto">{subtitle}</p>}
      {action}
    </div>
  );
}