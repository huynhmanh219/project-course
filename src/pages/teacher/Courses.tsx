import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialCourses = [
  { id: 1, tenKhoaHoc: "Toán 10", moTa: "Khóa học Toán nâng cao", ngayBatDau: "2024-06-01", ngayKetThuc: "2024-07-01", trangThai: true },
  { id: 2, tenKhoaHoc: "Văn 11", moTa: "Khóa học Văn cơ bản", ngayBatDau: "2024-06-10", ngayKetThuc: "2024-07-10", trangThai: false },
];

const TeacherCourses: React.FC = () => {
  const [courses, setCourses] = useState(initialCourses);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý khóa học</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate('/teacher/courses/add')}
      >
        Thêm khóa học
      </button>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="text-center">Tên khóa học</th>
            <th className="text-center">Mô tả</th>
            <th className="text-center">Ngày bắt đầu</th>
            <th className="text-center">Ngày kết thúc</th>
            <th className="text-center">Trạng thái</th>
            {/* <th className="text-center">Hành động</th> */}
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="text-center">
              <td className="text-center">{course.tenKhoaHoc}</td>
              <td className="text-center">{course.moTa}</td>
              <td className="text-center">{course.ngayBatDau}</td>
              <td className="text-center">{course.ngayKetThuc}</td>
              {/* <td className="text-center">{course.trangThai ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td> */}
              <td className="text-center">
                <button className="text-blue-600 mr-2" onClick={() => navigate(`/teacher/courses/edit/${course.id}`)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(course.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherCourses; 