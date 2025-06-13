import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Hash, FileText, GraduationCap } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

// Giả lập danh sách môn học
const monHocList = [
  { id: 1, ten: 'Toán cao cấp' },
  { id: 2, ten: 'Lập trình Web' },
  { id: 3, ten: 'Cơ sở dữ liệu' },
];

interface Lecture {
  Ten_Bai_Giang: string;
  Mo_Ta: string;
  Thu_Tu: number;
  Noi_Dung: string;
  Mon_Hoc_ID: number;
}

const LectureEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lecture, setLecture] = useState<Lecture>({
    Ten_Bai_Giang: '',
    Mo_Ta: '',
    Thu_Tu: 1,
    Noi_Dung: '',
    Mon_Hoc_ID: monHocList[0].id,
  });

  useEffect(() => {
    // TODO: Gọi API lấy thông tin bài giảng theo id
    // Giả lập dữ liệu
    setLecture({
      Ten_Bai_Giang: "Giới thiệu về Toán cao cấp",
      Mo_Ta: "Bài giảng đầu tiên về Toán cao cấp",
      Thu_Tu: 1,
      Noi_Dung: "Nội dung chi tiết của bài giảng...",
      Mon_Hoc_ID: 1,
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API cập nhật bài giảng
    console.log('Cập nhật bài giảng:', lecture);
    navigate('/teacher/lectures');
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
                onClick={() => navigate('/teacher/lectures')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Chỉnh sửa bài giảng</h1>
                  <p className="text-blue-100 text-lg mt-1">Cập nhật thông tin bài giảng</p>
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
                    value={lecture.Mon_Hoc_ID}
                    onChange={e => setLecture({ ...lecture, Mon_Hoc_ID: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    required
                  >
                    {monHocList.map(mh => (
                      <option key={mh.id} value={mh.id}>{mh.ten}</option>
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
                    value={lecture.Thu_Tu}
                    onChange={e => setLecture({ ...lecture, Thu_Tu: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                    placeholder="Nhập thứ tự bài giảng"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Tên bài giảng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lecture.Ten_Bai_Giang}
                  onChange={e => setLecture({ ...lecture, Ten_Bai_Giang: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Nhập tên bài giảng"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Mô tả
                </label>
                <textarea
                  value={lecture.Mo_Ta}
                  onChange={e => setLecture({ ...lecture, Mo_Ta: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  rows={3}
                  placeholder="Nhập mô tả bài giảng"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Nội dung bài giảng <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={lecture.Noi_Dung}
                  onChange={e => setLecture({ ...lecture, Noi_Dung: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  rows={12}
                  placeholder="Nhập nội dung chi tiết của bài giảng..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teacher/lectures')}
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

export default LectureEdit; 