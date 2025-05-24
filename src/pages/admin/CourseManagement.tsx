import React from 'react';

const courses = [
  { name: 'Toán 10', teacher: 'Nguyễn Văn A', classes: 2 },
  { name: 'Văn 11', teacher: 'Trần Thị B', classes: 1 },
];

const CourseManagement: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý khóa học</h1>
      <p className="mb-6 text-gray-600">Quản lý thông tin các khóa học, phân công giáo viên.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên khóa học</th>
              <th className="px-4 py-2 border">Giáo viên phụ trách</th>
              <th className="px-4 py-2 border">Số lớp</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{course.name}</td>
                <td className="px-4 py-2 border">{course.teacher}</td>
                <td className="px-4 py-2 border">{course.classes}</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-500 hover:underline mr-2">Sửa</button>
                  <button className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement; 