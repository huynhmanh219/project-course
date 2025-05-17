import React from 'react';

interface ClassCardProps {
  title: string;
  description: string;
  teacher: string;
  studentsCount: number;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  title,
  description,
  teacher,
  studentsCount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition cursor-pointer max-w-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Teacher: {teacher}</span>
        <span>{studentsCount} students</span>
      </div>
    </div>
  );
};
