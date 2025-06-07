import React from "react";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  return (
    <div className={`w-full h-3 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}; 