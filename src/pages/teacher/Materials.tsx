import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FilePlus, Edit, Trash2, Info } from "lucide-react";

const initialMaterials = [
  { id: 1, name: "Tài liệu HTML.pdf", type: "PDF", uploadedAt: "2024-06-01" },
  { id: 2, name: "Slide CSS.pptx", type: "PPT", uploadedAt: "2024-06-02" },
  { id: 3, name: "Video bài giảng 1.mp4", type: "VIDEO", uploadedAt: "2024-06-03" },
];

const typeBadge = (type: string) => {
  const color =
    type === "PDF"
      ? "bg-red-100 text-red-800"
      : type === "PPT"
      ? "bg-orange-100 text-orange-800"
      : type === "VIDEO"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>{type}</span>
  );
};

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState(initialMaterials);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" /> Quản lý tài liệu
            </h1>
            <p className="text-gray-500 text-base">Danh sách tài liệu các khoá học bạn phụ trách.</p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow hover:from-indigo-600 hover:to-blue-700 transition"
            onClick={() => navigate('/teacher/materials/add')}
          >
            <FilePlus className="w-5 h-5" /> Thêm tài liệu
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                <th className="px-4 py-3 text-left font-semibold">Tên tài liệu</th>
                <th className="px-4 py-3 text-left font-semibold">Loại</th>
                <th className="px-4 py-3 text-left font-semibold">Ngày upload</th>
                <th className="px-4 py-3 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    Không có tài liệu nào.
                  </td>
                </tr>
              ) : (
                materials.map((m) => (
                  <tr key={m.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-semibold text-blue-900">{m.name}</td>
                    <td className="px-4 py-3">{typeBadge(m.type)}</td>
                    <td className="px-4 py-3">{m.uploadedAt}</td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      <button className="flex items-center gap-1 text-green-600 hover:underline font-semibold" onClick={() => navigate(`/teacher/materials/edit/${m.id}`)}>
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                      <button className="flex items-center gap-1 text-red-600 hover:underline font-semibold" onClick={() => handleDelete(m.id)}>
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Materials; 