import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

const Select: React.FC<SelectProps> = ({ options, className, ...props }) => {
  return (
    <select
      className={`w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition duration-300 ${className}`}
      {...props}
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
};

export default Select;
