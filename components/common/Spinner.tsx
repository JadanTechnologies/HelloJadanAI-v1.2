import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="w-16 h-16 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
      {message && <p className="text-lg text-slate-300 font-semibold">{message}</p>}
    </div>
  );
};

export default Spinner;
