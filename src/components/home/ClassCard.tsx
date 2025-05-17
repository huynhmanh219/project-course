import React from 'react';

interface ClassCardProps {
  id: string;
  title: string;
  description: string;
  teacher: string;
  studentsCount: number;
  onClick?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  id,
  title,
  description,
  teacher,
  studentsCount,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow p-5 hover:shadow-md transition cursor-pointer max-w-sm"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Teacher: {teacher}</span>
        <span>{studentsCount} students</span>
      </div>
    </div>
  );
};
