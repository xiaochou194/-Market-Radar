import React from 'react';

export const Card = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-all duration-200 ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
