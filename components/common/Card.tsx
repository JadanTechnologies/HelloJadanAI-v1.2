import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-xl transition-all duration-300 hover:shadow-indigo-500/20 dark:hover:shadow-brand-cyan/20 hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
};

export default Card;