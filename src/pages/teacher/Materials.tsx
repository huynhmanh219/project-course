import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialMaterials = [
  { id: 1, tenTaiLieu: "Bài giảng 1", moTa: "Tài liệu PDF chương 1", loaiTaiLieu: "PDF", duongDanFile: "bai-giang-1.pdf", ngayUpload: "2024-06-01", trangThai: true },
  { id: 2, tenTaiLieu: "Video bài 2", moTa: "Video bài giảng chương 2", loaiTaiLieu: "VIDEO", duongDanFile: "video-bai-2.mp4", ngayUpload: "2024-06-02", trangThai: true },
];

const TeacherMaterials: React.FC = () => {
  const [materials, setMaterials] = useState(initialMaterials);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý tài liệu</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate('/teacher/materials/add')}
      >
        Thêm tài liệu
      </button>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="text-center">Tên tài liệu</th>
            <th className="text-center">Mô tả</th>
            <th className="text-center">Loại tài liệu</th>
            <th className="text-center">Đường dẫn file</th>
            <th className="text-center">Ngày upload</th>
            <th className="text-center">Trạng thái</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id} className="text-center">
              <td className="text-center">{m.tenTaiLieu}</td>
              <td className="text-center">{m.moTa}</td>
              <td className="text-center">{m.loaiTaiLieu}</td>
              <td className="text-center"><a href={m.duongDanFile} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{m.duongDanFile}</a></td>
              <td className="text-center">{m.ngayUpload}</td>
              <td className="text-center">{m.trangThai ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td>
              <td className="text-center">
                <button className="text-blue-600 mr-2" onClick={() => navigate(`/teacher/materials/edit/${m.id}`)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(m.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherMaterials; 