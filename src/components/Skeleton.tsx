import React from 'react';

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-slate-200/50 rounded-2xl ${className}`} />
  );
};

export default Skeleton;
