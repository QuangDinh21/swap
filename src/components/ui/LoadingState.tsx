import React from 'react';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

export default function LoadingState({ title = 'Loading...', subtitle }: LoadingStateProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 text-center">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin mx-auto mb-4" />
      <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
    </div>
  );
}