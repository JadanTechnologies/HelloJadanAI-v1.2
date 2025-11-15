import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
