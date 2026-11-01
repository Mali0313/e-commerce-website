import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-48 sm:h-72 bg-gray-100 rounded-3xl" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 space-y-3">
            <div className="aspect-4/5 bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-100 rounded-md w-3/4" />
            <div className="h-4 bg-gray-100 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

