import React from 'react';
import { cn } from '../../utils/common';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'compact' | 'glass' | 'stat';
  glow?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: 'card',
  compact: 'card-compact',
  glass: 'glass-card',
  stat: 'stat-card'
};

export function Card({
  variant = 'default',
  glow = false,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardVariants[variant],
        glow && 'glow-effect group',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function CardHeader({
  icon,
  title,
  subtitle,
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-center mb-6', className)} {...props}>
      {icon && (
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-slate-100', className)} {...props}>
      {children}
    </div>
  );
}