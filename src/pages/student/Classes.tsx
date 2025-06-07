import React from "react";
import { useNavigate } from "react-router-dom";

const initialClasses = [
  {
    id: 1,
    tenLop: "Lớp Toán 10A",
    tenKhoaHoc: "Toán 10",
    giangVien: "Nguyễn Văn A",
    moTa: "Lớp học Toán nâng cao cho học sinh lớp 10",
    trangThai: true,
  },
  {
    id: 2,
    tenLop: "Lớp Văn 11B",
    tenKhoaHoc: "Ngữ Văn 11",
    giangVien: "Trần Thị B",
    moTa: "Lớp học Văn dành cho học sinh lớp 11",
    trangThai: true,
  },
  {
    id: 3,
    tenLop: "Lớp Lý 12C",
    tenKhoaHoc: "Vật Lý 12",
    giangVien: "Lê Văn C",
    moTa: "Lớp học Vật Lý chuyên sâu lớp 12",
    trangThai: false,
  },
];

const StudentClasses: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Danh sách lớp học </h1>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Tên lớp</th>
            <th className="px-4 py-2 border">Khóa học</th>
            <th className="px-4 py-2 border">Giảng viên</th>
            <th className="px-4 py-2 border">Mô tả</th>
            <th className="px-4 py-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {initialClasses.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">Không có lớp học nào đang mở.</td>
            </tr>
          ) : (
            initialClasses.map((cls) => (
              <tr key={cls.id} className="text-center">
                <td className="px-4 py-2 border font-semibold">
                  <button className="text-blue-700 underline hover:text-blue-900" onClick={() => navigate(`/student/classes/${cls.id}`)}>
                    {cls.tenLop}
                  </button>
                </td>
                <td className="px-4 py-2 border">{cls.tenKhoaHoc}</td>
                <td className="px-4 py-2 border">{cls.giangVien}</td>
                <td className="px-4 py-2 border">{cls.moTa}</td>
                <td className="px-4 py-2 border">{cls.trangThai ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentClasses; 