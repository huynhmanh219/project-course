import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText } from 'lucide-react';

// Giả lập danh sách bài giảng
const baiGiangList = [
  { id: 1, ten: 'Giới thiệu về Toán cao cấp', monHoc: 'Toán cao cấp' },
  { id: 2, ten: 'Các khái niệm cơ bản về Web', monHoc: 'Lập trình Web' },
  { id: 3, ten: 'Tổng quan về CSDL', monHoc: 'Cơ sở dữ liệu' },
];

interface Material {
  Ten_Tai_Lieu: string;
  Mo_Ta: string;
  Loai_Tai_Lieu: number;
  Duong_Dan_File: string;
  Bai_Giang_ID: number;
}

const MaterialAdd: React.FC = () => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material>({
    Ten_Tai_Lieu: '',
    Mo_Ta: '',
    Loai_Tai_Lieu: 1,
    Duong_Dan_File: '',
    Bai_Giang_ID: baiGiangList[0].id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setMaterial({
      ...material,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMaterial({ ...material, Duong_Dan_File: e.target.files[0].name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API thêm tài liệu
    console.log('Thêm tài liệu:', material);
    navigate('/teacher/materials');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/teacher/materials')}
            className="p-2 hover:bg-blue-100 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-blue-700">Thêm tài liệu mới</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Bài giảng <span className="text-red-500">*</span></label>
            <select
              value={material.Bai_Giang_ID}
              onChange={e => setMaterial({ ...material, Bai_Giang_ID: Number(e.target.value) })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              {baiGiangList.map(bg => (
                <option key={bg.id} value={bg.id}>
                  {bg.ten} ({bg.monHoc})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tên tài liệu <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={material.Ten_Tai_Lieu}
              onChange={e => setMaterial({ ...material, Ten_Tai_Lieu: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên tài liệu"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
            <textarea
              value={material.Mo_Ta}
              onChange={e => setMaterial({ ...material, Mo_Ta: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              placeholder="Nhập mô tả tài liệu"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Loại tài liệu <span className="text-red-500">*</span></label>
            <select
              value={material.Loai_Tai_Lieu}
              onChange={e => setMaterial({ ...material, Loai_Tai_Lieu: Number(e.target.value) })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value={1}>Tài liệu học tập</option>
              <option value={2}>Bài tập</option>
              <option value={3}>Đề thi</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">File tài liệu <span className="text-red-500">*</span></label>
            <input
              type="file"
              required
              onChange={e => setMaterial({ ...material, Duong_Dan_File: e.target.files?.[0]?.name || '' })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/materials')}
              className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl font-bold shadow hover:from-gray-500 hover:to-gray-700 transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition duration-200 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialAdd; 