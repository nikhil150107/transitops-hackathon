import React from 'react';

const Skeleton = ({ className = '', variant = 'text', ...props }) => {
  const baseClasses = 'animate-pulse bg-slate-200/80 dark:bg-slate-700/60';
  
  const variants = {
    text: 'h-3 w-full rounded-md',
    title: 'h-5 w-2/3 rounded-lg',
    circle: 'rounded-full',
    rect: 'rounded-2xl',
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
};

export default Skeleton;
