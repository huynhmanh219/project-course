import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, BookOpen, Upload, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

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

const MaterialEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [material, setMaterial] = useState<Material>({
    Ten_Tai_Lieu: '',
    Mo_Ta: '',
    Loai_Tai_Lieu: 1,
    Duong_Dan_File: '',
    Bai_Giang_ID: baiGiangList[0].id,
  });

  useEffect(() => {
    // TODO: Gọi API lấy thông tin tài liệu
    // Giả lập dữ liệu
    setMaterial({
      Ten_Tai_Lieu: 'Tài liệu mẫu',
      Mo_Ta: 'Mô tả tài liệu mẫu',
      Loai_Tai_Lieu: 1,
      Duong_Dan_File: 'example.pdf',
      Bai_Giang_ID: 1,
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API cập nhật tài liệu
    console.log('Cập nhật tài liệu:', material);
    navigate('/teacher/materials');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/teacher/materials')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Chỉnh sửa tài liệu</h1>
                  <p className="text-blue-100 text-lg mt-1">Cập nhật thông tin tài liệu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Bài giảng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={material.Bai_Giang_ID}
                    onChange={e => setMaterial({ ...material, Bai_Giang_ID: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    required
                  >
                    {baiGiangList.map(bg => (
                      <option key={bg.id} value={bg.id}>
                        {bg.ten} ({bg.monHoc})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-500" />
                    Loại tài liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={material.Loai_Tai_Lieu}
                    onChange={e => setMaterial({ ...material, Loai_Tai_Lieu: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value={1}>Tài liệu học tập</option>
                    <option value={2}>Bài tập</option>
                    <option value={3}>Đề thi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Tên tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={material.Ten_Tai_Lieu}
                  onChange={e => setMaterial({ ...material, Ten_Tai_Lieu: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Nhập tên tài liệu"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Mô tả
                </label>
                <textarea
                  value={material.Mo_Ta}
                  onChange={e => setMaterial({ ...material, Mo_Ta: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  rows={4}
                  placeholder="Nhập mô tả tài liệu"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  File tài liệu
                </label>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">File hiện tại: {material.Duong_Dan_File}</p>
                  </div>
                  <input
                    type="file"
                    onChange={e => setMaterial({ ...material, Duong_Dan_File: e.target.files?.[0]?.name || material.Duong_Dan_File })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-sm text-gray-500">Để trống nếu không muốn thay đổi file</p>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teacher/materials')}
                  className="px-8 py-3 bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialEdit; 