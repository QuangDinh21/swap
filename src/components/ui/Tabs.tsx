import React from 'react';
import { cn } from '../../utils/common';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export interface SimpleTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex space-x-1 p-1.5 rounded-xl border border-white/40 shadow-sm bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            'tab-button text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2',
            activeTab === tab.id ? 'active' : 'inactive',
            tab.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {tab.icon && <span className="text-xs lg:text-sm">{tab.icon}</span>}
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Simplified version for easier use
export function SimpleTabs({
  value,
  onValueChange,
  options,
  className,
}: SimpleTabsProps) {
  return (
    <div
      className={cn(
        'flex space-x-1 p-1.5 rounded-xl border border-white/40 shadow-sm bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => !option.disabled && onValueChange(option.value)}
          disabled={option.disabled}
          className={cn(
            'tab-button text-sm px-3 py-2 flex-1 min-h-[44px]', // Ensure 44px minimum touch target
            value === option.value ? 'active' : 'inactive',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {option.icon && <span className="text-sm mr-1.5">{option.icon}</span>}
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export interface TabContentProps {
  activeTab: string;
  tabId: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({
  activeTab,
  tabId,
  children,
  className,
}: TabContentProps) {
  if (activeTab !== tabId) return null;

  return <div className={cn('mt-8', className)}>{children}</div>;
}
