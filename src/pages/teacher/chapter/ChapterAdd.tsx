import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Hash, FileText, Layers, Plus, GraduationCap } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

// Giả lập danh sách môn học
const monHocList = [
  { id: 1, ten: 'Toán cao cấp' },
  { id: 2, ten: 'Lập trình Web' },
  { id: 3, ten: 'Cơ sở dữ liệu' },
];

interface Chapter {
  Ten_Chuong: string;
  Mo_Ta: string;
  Thu_Tu: number;
  Mon_Hoc_ID: number;
}

const ChapterAdd: React.FC = () => {
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter>({
    Ten_Chuong: '',
    Mo_Ta: '',
    Thu_Tu: 1,
    Mon_Hoc_ID: monHocList[0].id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API thêm chương
    console.log('Thêm chương:', chapter);
    navigate('/teacher/chapters');
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
                onClick={() => navigate('/teacher/chapters')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Thêm chương mới</h1>
                  <p className="text-blue-100 text-lg mt-1">Tạo chương mới cho môn học</p>
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
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Môn học <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={chapter.Mon_Hoc_ID}
                    onChange={e => setChapter({ ...chapter, Mon_Hoc_ID: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    required
                  >
                    {monHocList.map(mh => (
                      <option key={mh.id} value={mh.id}>
                        {mh.ten}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-indigo-500" />
                    Thứ tự <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={chapter.Thu_Tu}
                    onChange={e => setChapter({ ...chapter, Thu_Tu: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    placeholder="Nhập thứ tự chương"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Tên chương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={chapter.Ten_Chuong}
                  onChange={e => setChapter({ ...chapter, Ten_Chuong: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Nhập tên chương"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Mô tả
                </label>
                <textarea
                  value={chapter.Mo_Ta}
                  onChange={e => setChapter({ ...chapter, Mo_Ta: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  rows={6}
                  placeholder="Nhập mô tả chi tiết cho chương..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base transition-all duration-200"
                  onClick={() => navigate('/teacher/chapters')}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base transition-all duration-200"
                >
                  <Plus className="w-5 h-5" /> Lưu
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChapterAdd; 