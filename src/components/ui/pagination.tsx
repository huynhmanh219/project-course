import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={currentPage === 1}
        onClick={() => go(currentPage - 1)}
      >
        Prev
      </button>
      {pages.map(p => (
        <button
          key={p}
          className={`px-3 py-1 rounded text-sm border ${p === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={currentPage === totalPages}
        onClick={() => go(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}; 