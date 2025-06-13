import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';

// Giả lập danh sách bài giảng
const baiGiangList = [
  { id: 1, ten: 'Giới thiệu về Toán cao cấp', monHoc: 'Toán cao cấp' },
  { id: 2, ten: 'Các khái niệm cơ bản về Web', monHoc: 'Lập trình Web' },
  { id: 3, ten: 'Tổng quan về CSDL', monHoc: 'Cơ sở dữ liệu' },
];

interface Chapter {
  Ten_Chuong: string;
  Mo_Ta: string;
  Thu_Tu: number;
  Bai_Giang_ID: number;
}

const ChapterEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chapter, setChapter] = useState<Chapter>({
    Ten_Chuong: '',
    Mo_Ta: '',
    Thu_Tu: 1,
    Bai_Giang_ID: baiGiangList[0].id,
  });

  useEffect(() => {
    // TODO: Gọi API lấy thông tin chương
    // Giả lập dữ liệu
    setChapter({
      Ten_Chuong: 'Chương mẫu',
      Mo_Ta: 'Mô tả chương mẫu',
      Thu_Tu: 1,
      Bai_Giang_ID: 1,
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API cập nhật chương
    console.log('Cập nhật chương:', chapter);
    navigate('/teacher/chapters');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/teacher/chapters')}
            className="p-2 hover:bg-blue-100 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-blue-700">Chỉnh sửa chương</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Bài giảng <span className="text-red-500">*</span></label>
            <select
              value={chapter.Bai_Giang_ID}
              onChange={e => setChapter({ ...chapter, Bai_Giang_ID: Number(e.target.value) })}
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
            <label className="block text-gray-700 font-medium mb-1">Tên chương <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={chapter.Ten_Chuong}
              onChange={e => setChapter({ ...chapter, Ten_Chuong: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên chương"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
            <textarea
              value={chapter.Mo_Ta}
              onChange={e => setChapter({ ...chapter, Mo_Ta: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              placeholder="Nhập mô tả chương"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Thứ tự <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="1"
              value={chapter.Thu_Tu}
              onChange={e => setChapter({ ...chapter, Thu_Tu: Number(e.target.value) })}
              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/chapters')}
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

export default ChapterEdit; 