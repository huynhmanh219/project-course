import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';

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

const LectureAdd: React.FC = () => {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture>({
    Ten_Bai_Giang: '',
    Mo_Ta: '',
    Thu_Tu: 1,
    Noi_Dung: '',
    Mon_Hoc_ID: monHocList[0].id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API thêm bài giảng
    console.log('Thêm bài giảng:', lecture);
    navigate('/teacher/lectures');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/teacher/lectures')}
            className="p-2 hover:bg-blue-100 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-blue-700">Đăng bài giảng mới</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Môn học <span className="text-red-500">*</span></label>
            <select
              value={lecture.Mon_Hoc_ID}
              onChange={e => setLecture({ ...lecture, Mon_Hoc_ID: Number(e.target.value) })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              {monHocList.map(mh => (
                <option key={mh.id} value={mh.id}>{mh.ten}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tên bài giảng <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={lecture.Ten_Bai_Giang}
              onChange={e => setLecture({ ...lecture, Ten_Bai_Giang: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên bài giảng"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
            <textarea
              value={lecture.Mo_Ta}
              onChange={e => setLecture({ ...lecture, Mo_Ta: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              placeholder="Nhập mô tả bài giảng"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Thứ tự <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="1"
              value={lecture.Thu_Tu}
              onChange={e => setLecture({ ...lecture, Thu_Tu: Number(e.target.value) })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nội dung bài giảng <span className="text-red-500">*</span></label>
            <textarea
              required
              value={lecture.Noi_Dung}
              onChange={e => setLecture({ ...lecture, Noi_Dung: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={10}
              placeholder="Nhập nội dung bài giảng"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/lectures')}
              className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl font-bold shadow hover:from-gray-500 hover:to-gray-700 transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition duration-200 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Lưu bài giảng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LectureAdd; 