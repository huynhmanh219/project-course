import React from 'react';

const classes = [
  { name: 'Lớp 10A1', teacher: 'Nguyễn Văn A', students: 35 },
  { name: 'Lớp 11B2', teacher: 'Trần Thị B', students: 32 },
];

const ClassManagement: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý lớp học</h1>
      <p className="mb-6 text-gray-600">Tạo, chỉnh sửa, xóa và quản lý các lớp học.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên lớp</th>
              <th className="px-4 py-2 border">Giáo viên</th>
              <th className="px-4 py-2 border">Số học sinh</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{cls.name}</td>
                <td className="px-4 py-2 border">{cls.teacher}</td>
                <td className="px-4 py-2 border">{cls.students}</td>
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

export default ClassManagement; 