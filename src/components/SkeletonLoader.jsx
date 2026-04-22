import React from 'react';

export const Skeleton = ({ className }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="w-full space-y-4">
    <div className="flex gap-4 mb-4">
      {[...Array(cols)].map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 py-3 border-t border-gray-50">
        {[...Array(cols)].map((_, j) => (
          <Skeleton key={j} className="h-10 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="h-6 w-16" />
    </div>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="pt-4 flex gap-2">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </div>
);
