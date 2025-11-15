import React from 'react';

interface GenerationProgressProps {
  progress: number;
  message: string;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ progress, message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center w-full">
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className="bg-brand-cyan h-2.5 rounded-full transition-all duration-300 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xl font-bold text-white">{progress.toFixed(0)}%</p>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
};

export default GenerationProgress;