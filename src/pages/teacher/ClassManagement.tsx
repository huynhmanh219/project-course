import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const courseOptions = [
  { id: 1, name: 'Toán 10' },
  { id: 2, name: 'Văn 11' },
];
const teacherOptions = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
];

const initialClasses = [
  { id: 1, name: 'Lớp 10A1', courseId: 1, teacherId: 1, description: 'Lớp chuyên Toán', status: true, createdAt: '2024-06-01 10:00' },
  { id: 2, name: 'Lớp 11B2', courseId: 2, teacherId: 2, description: 'Lớp chuyên Văn', status: false, createdAt: '2024-06-02 09:30' },
];

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState(initialClasses);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setClasses(classes.filter((cls) => cls.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý lớp học</h1>
      <p className="mb-6 text-gray-600">Tạo, chỉnh sửa, xóa và quản lý các lớp học.</p>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate('/teacher/my-classes/add')}
      >
        Thêm lớp học
      </button>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="text-center">Tên lớp</th>
            <th className="text-center">Khóa học</th>
            <th className="text-center">Giảng viên</th>
            <th className="text-center">Ngày tạo</th>
            <th className="text-center">Trạng thái</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id} className="text-center">
              <td className="text-center">{cls.name}</td>
              <td className="text-center">{courseOptions.find(c => c.id === cls.courseId)?.name}</td>
              <td className="text-center">{teacherOptions.find(t => t.id === cls.teacherId)?.name}</td>
              <td className="text-center">{cls.createdAt}</td>
              {/* <td className="text-center">{cls.status ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td> */}
              <td className="text-center">
                <button className="text-blue-500 hover:underline mr-2" onClick={() => navigate(`/teacher/my-classes/edit/${cls.id}`)}>Sửa</button>
                <button className="text-red-500 hover:underline" onClick={() => handleDelete(cls.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassManagement; 