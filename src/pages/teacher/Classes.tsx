import React from 'react';

const teacherClasses = [
  {
    className: 'Lớp 10A1',
    courseName: 'Toán 10',
    students: 35,
    createdAt: '2024-06-01',
    status: true,
  },
  {
    className: 'Lớp 11B2',
    courseName: 'Văn 11',
    students: 32,
    createdAt: '2024-06-02',
    status: false,
  },
];

const TeacherClasses: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Danh sách lớp phụ trách</h1>
      <p className="mb-6 text-gray-600">Quản lý các lớp học mà bạn đang phụ trách.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên lớp</th>
              <th className="px-4 py-2 border">Khóa học</th>
              <th className="px-4 py-2 border">Số sinh viên</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {teacherClasses.map((cls, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{cls.className}</td>
                <td className="px-4 py-2 border">{cls.courseName}</td>
                <td className="px-4 py-2 border">{cls.students}</td>
                <td className="px-4 py-2 border">{cls.createdAt}</td>
                <td className="px-4 py-2 border">{cls.status ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-500 hover:underline mr-2">Xem chi tiết</button>
                  <button className="text-indigo-500 hover:underline">Quản lý sinh viên</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherClasses; 