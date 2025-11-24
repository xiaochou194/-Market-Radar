import React from 'react';

export const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'up' | 'down' | 'neutral' }) => {
  const colors = {
    up: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    down: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
};
