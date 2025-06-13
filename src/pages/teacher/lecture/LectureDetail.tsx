import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen } from 'lucide-react';

interface Lecture {
  id: number;
  Ten_Bai_Giang: string;
  Mo_Ta: string;
  Thu_Tu: number;
  Noi_Dung: string;
  Mon_Hoc_ID: number;
  Ngay_Tao: string;
}

const monHocList = [
  { id: 1, ten: 'Toán cao cấp' },
  { id: 2, ten: 'Lập trình Web' },
  { id: 3, ten: 'Cơ sở dữ liệu' },
];

const LectureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lecture, setLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    // TODO: Gọi API lấy thông tin bài giảng theo id
    // Giả lập dữ liệu
    setLecture({
      id: Number(id),
      Ten_Bai_Giang: "Giới thiệu về Toán cao cấp",
      Mo_Ta: "Bài giảng đầu tiên về Toán cao cấp",
      Thu_Tu: 1,
      Noi_Dung: "Nội dung chi tiết của bài giảng...",
      Mon_Hoc_ID: 1,
      Ngay_Tao: "2024-03-15"
    });
  }, [id]);

  if (!lecture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/teacher/lectures')}
            className="p-2 hover:bg-blue-100 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-blue-700">Chi tiết bài giảng</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{lecture.Ten_Bai_Giang}</h2>
              <p className="text-gray-500">Môn học: {monHocList.find(mh => mh.id === lecture.Mon_Hoc_ID)?.ten}</p>
            </div>
            <button
              onClick={() => navigate(`/teacher/lectures/edit/${lecture.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition duration-200"
            >
              <Edit className="w-4 h-4" /> Chỉnh sửa
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Mô tả</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{lecture.Mo_Ta}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Thứ tự</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{lecture.Thu_Tu}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nội dung bài giảng</h3>
              <div className="text-gray-600 bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                {lecture.Noi_Dung}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ngày tạo</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{lecture.Ngay_Tao}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetail; 