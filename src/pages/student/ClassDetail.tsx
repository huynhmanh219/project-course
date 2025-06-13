import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { BookOpen, User2, FileText, Users, Info, CheckCircle, XCircle, FileDown, Play, Clock, ChevronRight } from "lucide-react";

const classInfo = {
  tenLop: "Lớp Toán 10A",
  tenKhoaHoc: "Toán 10",
  giangVien: "Nguyễn Văn A",
  moTa: "Lớp học Toán nâng cao cho học sinh lớp 10",
  trangThai: true,
};

const materials = [
  { id: 1, tenTaiLieu: "Bài giảng 1", loaiTaiLieu: "PDF", duongDanFile: "bai-giang-1.pdf" },
  { id: 2, tenTaiLieu: "Video bài 2", loaiTaiLieu: "VIDEO", duongDanFile: "video-bai-2.mp4" },
  { id: 3, tenTaiLieu: "Slide bài 3", loaiTaiLieu: "PPT", duongDanFile: "slide-bai-3.pptx" },
];

const lectures = [
  {
    id: 1,
    title: "Bài 1: Hàm số và đồ thị",
    description: "Tìm hiểu về khái niệm hàm số, cách vẽ đồ thị và các tính chất cơ bản",
    duration: "45 phút",
    completed: true,
    content: `# Bài 1: Hàm số và đồ thị

## 1. Khái niệm hàm số
Hàm số là một quy tắc đặt tương ứng mỗi giá trị của biến số x trong tập xác định với một giá trị duy nhất của y.

## 2. Cách biểu diễn hàm số
- Bằng công thức: y = f(x)
- Bằng bảng giá trị
- Bằng đồ thị

## 3. Tính chất của hàm số
- Tập xác định
- Tập giá trị
- Tính đơn điệu
- Tính chẵn lẻ`,
    videoUrl: "https://example.com/video1.mp4"
  },
  {
    id: 2,
    title: "Bài 2: Phương trình bậc hai",
    description: "Học cách giải phương trình bậc hai và ứng dụng thực tế",
    duration: "50 phút",
    completed: true,
    content: `# Bài 2: Phương trình bậc hai

## 1. Dạng tổng quát
Phương trình bậc hai có dạng: ax² + bx + c = 0 (a ≠ 0)

## 2. Công thức nghiệm
Δ = b² - 4ac
- Nếu Δ > 0: phương trình có 2 nghiệm phân biệt
- Nếu Δ = 0: phương trình có nghiệm kép
- Nếu Δ < 0: phương trình vô nghiệm

## 3. Ứng dụng
- Bài toán tối ưu
- Bài toán chuyển động
- Bài toán hình học`,
    videoUrl: "https://example.com/video2.mp4"
  },
  {
    id: 3,
    title: "Bài 3: Bất phương trình",
    description: "Phương pháp giải bất phương trình và hệ bất phương trình",
    duration: "40 phút",
    completed: false,
    content: `# Bài 3: Bất phương trình

## 1. Khái niệm
Bất phương trình là một mệnh đề chứa ẩn số với dấu bất đẳng thức.

## 2. Các phép biến đổi
- Cộng, trừ cùng một số
- Nhân, chia với số dương
- Nhân, chia với số âm (đổi dấu)

## 3. Phương pháp giải
- Phương pháp khoảng
- Phương pháp đồ thị
- Phương pháp đặt ẩn phụ`,
    videoUrl: "https://example.com/video3.mp4"
  }
];

const members = [
  { id: 1, hoTen: "Nguyễn Văn A", vaiTro: "Giáo viên", avatar: "GV" },
  { id: 2, hoTen: "Trần Thị B", vaiTro: "Sinh viên", avatar: "TB" },
  { id: 3, hoTen: "Lê Văn C", vaiTro: "Sinh viên", avatar: "LC" },
  { id: 4, hoTen: "Phạm Thị D", vaiTro: "Sinh viên", avatar: "PD" },
  { id: 5, hoTen: "Hoàng Văn E", vaiTro: "Sinh viên", avatar: "HE" },
];

const ClassDetail: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState(lectures[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <Button
          variant="default"
          className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
          onClick={() => navigate("/student/classes")}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Quay lại danh sách lớp học
        </Button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{classInfo.tenLop}</h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-2">
                    <User2 className="w-4 h-4" />
                    {classInfo.giangVien}
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {classInfo.tenKhoaHoc}
                  </span>
                  {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đang hoạt động
                  </span> */}
                </div>
              </div>
            </div>
            <p className="text-blue-100 text-lg">{classInfo.moTa}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Materials and Members */}
          <div className="space-y-8">
            {/* Section: Tài liệu */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Tài liệu lớp học
              </h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {materials.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có tài liệu nào</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {materials.map(m => (
                      <div key={m.id} className="p-4 hover:bg-blue-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            m.loaiTaiLieu === 'PDF' ? 'bg-red-100 text-red-800' : 
                            m.loaiTaiLieu === 'VIDEO' ? 'bg-blue-100 text-blue-800' : 
                            m.loaiTaiLieu === 'PPT' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {m.loaiTaiLieu}
                          </span>
                          <span className="font-semibold flex-1 text-gray-800">{m.tenTaiLieu}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <FileDown className="w-4 h-4 mr-1" />
                            Tải về
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Section: Thành viên */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                Thành viên ({members.length})
              </h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {members.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có thành viên nào</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {members.map(m => (
                      <div key={m.id} className="p-4 hover:bg-purple-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            m.vaiTro === 'Giáo viên' ? 'bg-purple-500' : 'bg-blue-500'
                          }`}>
                            {m.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{m.hoTen}</div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              m.vaiTro === 'Giáo viên' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {m.vaiTro}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Lecture Content */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-orange-600" />
                </div>
                Nội dung bài giảng
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lecture List */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Danh sách bài giảng</h3>
                    <div className="space-y-2">
                      {lectures.map((lecture, index) => (
                        <div
                          key={lecture.id}
                          onClick={() => setSelectedLecture(lecture)}
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedLecture.id === lecture.id
                              ? 'bg-orange-500 text-white shadow-lg'
                              : 'bg-gray-50 hover:bg-orange-50 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              selectedLecture.id === lecture.id
                                ? 'bg-white text-orange-500'
                                : 'bg-orange-500 text-white'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{lecture.title}</div>
                              <div className={`text-xs mt-1 flex items-center gap-2 ${
                                selectedLecture.id === lecture.id ? 'text-orange-100' : 'text-gray-500'
                              }`}>
                                <Clock className="w-3 h-3" />
                                {lecture.duration}
                              </div>
                            </div>
                            {lecture.completed && (
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                selectedLecture.id === lecture.id ? 'bg-white' : 'bg-green-500'
                              }`}>
                                <CheckCircle className={`w-3 h-3 ${
                                  selectedLecture.id === lecture.id ? 'text-green-500' : 'text-white'
                                }`} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lecture Content */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Lecture Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{selectedLecture.title}</h3>
                          <p className="text-orange-100 text-sm">{selectedLecture.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs text-orange-100">Thời lượng</div>
                            <div className="font-semibold">{selectedLecture.duration}</div>
                          </div>
                          {selectedLecture.completed && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lecture Content */}
                    <div className="p-6">
                      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                          {selectedLecture.content}
                        </pre>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {!selectedLecture.completed && (
                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Đánh dấu hoàn thành
                            </Button>
                          )}
                          <Button variant="default" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                            <FileDown className="w-4 h-4 mr-2" />
                            Tải tài liệu
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            disabled={lectures.findIndex(l => l.id === selectedLecture.id) === 0}
                            onClick={() => {
                              const currentIndex = lectures.findIndex(l => l.id === selectedLecture.id);
                              if (currentIndex > 0) {
                                setSelectedLecture(lectures[currentIndex - 1]);
                              }
                            }}
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            Trước
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            disabled={lectures.findIndex(l => l.id === selectedLecture.id) === lectures.length - 1}
                            onClick={() => {
                              const currentIndex = lectures.findIndex(l => l.id === selectedLecture.id);
                              if (currentIndex < lectures.length - 1) {
                                setSelectedLecture(lectures[currentIndex + 1]);
                              }
                            }}
                          >
                            Tiếp
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail; 