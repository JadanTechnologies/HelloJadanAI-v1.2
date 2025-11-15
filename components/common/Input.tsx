import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition duration-300 ${className}`}
      {...props}
    />
  );
};

export default Input;
