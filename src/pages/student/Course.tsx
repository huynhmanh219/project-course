import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { AnnouncementCard } from "../../components/course/AnnouncementCard";
import { AssignmentCard } from "../../components/course/AssignmentCard";
import { Button } from "../../components/ui/button";
import { Star, FileText, FileDown } from "lucide-react";

// Danh sách khoá học mẫu giống Courses.tsx
const sampleCourses = [
  {
    ID: 1,
    Ten_Khoa_Hoc: "Lập trình Web",
    Mo_Ta: "Khóa học về HTML, CSS, JavaScript và framework hiện đại.",
    Giang_Vien_ID: 1,
    Ngay_Bat_Dau: "2024-06-01",
    Ngay_Ket_Thuc: "2024-08-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Nguyễn Văn A" },
    tien_do: { Hoan_Thanh: false, phan_tram: 75 },
    code: "CS101",
    section: "A",
    teacher: "Nguyễn Văn A",
    description: "Khóa học về HTML, CSS, JavaScript và framework hiện đại.",
    progress: 75,
  },
  {
    ID: 2,
    Ten_Khoa_Hoc: "Toán Cao Cấp",
    Mo_Ta: "Giải tích, đại số tuyến tính và ứng dụng.",
    Giang_Vien_ID: 2,
    Ngay_Bat_Dau: "2024-07-01",
    Ngay_Ket_Thuc: "2024-09-01",
    Trang_Thai: true,
    giang_vien: { Ho_Ten: "Trần Thị B" },
    tien_do: { Hoan_Thanh: false, phan_tram: 40 },
    code: "MATH201",
    section: "B",
    teacher: "Trần Thị B",
    description: "Giải tích, đại số tuyến tính và ứng dụng.",
    progress: 40,
  },
  {
    ID: 3,
    Ten_Khoa_Hoc: "Kỹ năng mềm",
    Mo_Ta: "Phát triển kỹ năng giao tiếp, làm việc nhóm, thuyết trình.",
    Giang_Vien_ID: 3,
    Ngay_Bat_Dau: "2024-05-15",
    Ngay_Ket_Thuc: "2024-07-15",
    Trang_Thai: false,
    giang_vien: { Ho_Ten: "Lê Văn C" },
    tien_do: { Hoan_Thanh: true, phan_tram: 100 },
    code: "SKM101",
    section: "C",
    teacher: "Lê Văn C",
    description: "Phát triển kỹ năng giao tiếp, làm việc nhóm, thuyết trình.",
    progress: 100,
  },
];

export function Course() {
  const location = useLocation();
  const { id } = useParams();
  let course = location.state?.course || null;
  if (!course && id) {
    course = sampleCourses.find(c => String(c.ID) === String(id));
  }

  // Nếu không tìm thấy khoá học
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Không tìm thấy khoá học</h2>
          <p className="text-gray-600">Vui lòng quay lại trang danh sách khoá học.</p>
        </div>
      </div>
    );
  }

  // Dữ liệu mẫu cho các tab (có thể tuỳ biến theo course.ID)
  const announcements = [
    {
      id: 1,
      title: "Chào mừng đến với lớp học!",
      content: "Hãy đọc kỹ tài liệu và chuẩn bị cho buổi học đầu tiên.",
      time: "2 ngày trước",
      author: course.teacher,
    },
    {
      id: 2,
      title: "Nộp bài tập 1",
      content: "Hạn nộp bài tập 1 là ngày 15/06/2024.",
      time: "1 ngày trước",
      author: course.teacher,
    },
  ];
  const assignments = [
    {
      id: 1,
      title: "Bài tập 1: HTML cơ bản",
      due: "15/06/2024",
      status: "Chưa nộp",
      grade: null,
      file: "Tài liệu HTML.pdf",
    },
    {
      id: 2,
      title: "Bài tập 2: CSS Layout",
      due: "22/06/2024",
      status: "Đã nộp",
      grade: 9.0,
      file: "Slide CSS.pptx",
    },
  ];
  const materials = [
    { id: 1, name: "Tài liệu HTML.pdf", type: "PDF" },
    { id: 2, name: "Slide CSS.pptx", type: "PPT" },
    { id: 3, name: "Video bài giảng 1.mp4", type: "VIDEO" },
  ];
  const people = {
    teachers: [
      { id: 1, name: course.teacher, email: "nguyenvana@univ.edu" },
    ],
    students: [
      { id: 2, name: "Trần Thị B", email: "tranthib@univ.edu" },
      { id: 3, name: "Lê Văn C", email: "levanc@univ.edu" },
    ],
  };
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Điểm số cá nhân
  const myGrades = assignments.map(a => ({
    title: a.title,
    status: a.status,
    grade: a.grade,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h1 className="text-4xl font-bold">{course.name}</h1>
                </div>
                <div className="space-y-2 text-blue-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Mã lớp: {course.code} - Phần: {course.section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Giảng viên: <span className="font-semibold">{course.teacher}</span></span>
                  </div>
                  <p className="text-lg mt-3">{course.description}</p>
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[280px]">
                <div className="text-center text-white mb-4">
                  <div className="text-3xl font-bold">{course.progress}%</div>
                  <div className="text-blue-100">Tiến độ hoàn thành</div>
                </div>
                <div className="relative">
                  <Progress value={course.progress} className="h-3 bg-white/30" />
                  <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300" 
                       style={{width: `${course.progress}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <Tabs defaultValue="materials" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-gray-100 p-2 rounded-2xl">
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-transparent text-gray-600 font-semibold rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Tài liệu để học
              </TabsTrigger>
              <TabsTrigger
                value="classwork"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-transparent text-gray-600 font-semibold rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Bài tập</span>
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-transparent text-gray-600 font-semibold rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span className="hidden sm:inline">Thành viên</span>
              </TabsTrigger>
              <TabsTrigger
                value="grades"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-transparent text-gray-600 font-semibold rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Điểm số</span>
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-transparent text-gray-600 font-semibold rounded-xl px-4 py-3 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5v2.25a.75.75 0 001.5 0v-2.25a.75.75 0 000-1.5H9z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Đánh giá</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Tài liệu để học */}
            <TabsContent value="materials" className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Tài liệu để học</h2>
              </div>
              {materials.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  Chưa có tài liệu nào.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map(m => (
                    <div key={m.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          m.type === 'PDF' ? 'bg-red-100 text-red-800' :
                          m.type === 'PPT' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {m.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">{m.name}</h3>
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg flex items-center gap-2">
                        <FileDown className="w-4 h-4" />
                        Tải về
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab Bài tập & Tài liệu */}
            <TabsContent value="classwork" className="space-y-8">
              {/* Bài tập */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Bài tập</h2>
                </div>
                {assignments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Chưa có bài tập nào.
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {assignments.map(a => (
                      <div key={a.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Hạn nộp: {a.due}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  a.status === "Đã nộp" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {a.status}
                                </span>
                                {a.grade !== null && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    Điểm: {a.grade}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                              Xem chi tiết
                            </Button>
                            {a.status === "Chưa nộp" && (
                              <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                                Nộp bài
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tài liệu */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Tài liệu</h2>
                </div>
                {materials.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Chưa có tài liệu nào.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materials.map(m => (
                      <div key={m.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            m.type === 'PDF' ? 'bg-red-100 text-red-800' :
                            m.type === 'PPT' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {m.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">{m.name}</h3>
                        <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Tải về
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab Mọi người */}
            <TabsContent value="people" className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Thành viên lớp học</h2>
              </div>

              {/* Giảng viên */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Giảng viên
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {people.teachers.map(t => (
                    <div key={t.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {t.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-lg">{t.name}</div>
                          <div className="text-sm text-gray-600">{t.email}</div>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                            Giảng viên
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sinh viên */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  Sinh viên ({people.students.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {people.students.map(s => (
                    <div key={s.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {s.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-lg">{s.name}</div>
                          <div className="text-sm text-gray-600">{s.email}</div>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                            Sinh viên
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab Điểm số */}
            <TabsContent value="grades" className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Bảng điểm</h2>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Bài tập</th>
                        <th className="px-6 py-4 text-center font-semibold">Trạng thái</th>
                        <th className="px-6 py-4 text-center font-semibold">Điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myGrades.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-12 text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Chưa có điểm nào.
                          </td>
                        </tr>
                      ) : (
                        myGrades.map((g, idx) => (
                          <tr key={idx} className="border-b border-orange-100 hover:bg-orange-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800">{g.title}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                g.status === "Đã nộp" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {g.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {g.grade !== null ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                                  {g.grade}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Tab Đánh giá khóa học */}
            <TabsContent value="feedback" className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5v2.25a.75.75 0 001.5 0v-2.25a.75.75 0 000-1.5H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Đánh giá khóa học</h2>
              </div>

              <div className="max-w-2xl mx-auto">
                {submitted ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">Cảm ơn bạn đã đánh giá!</h3>
                    <div className="flex justify-center items-center gap-1 mb-4">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} size={24} />
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-4 text-gray-800 italic">
                      "{feedback}"
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-8 shadow-lg">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Hãy chia sẻ trải nghiệm của bạn</h3>
                        <div className="flex justify-center gap-2 mb-6">
                          {[1,2,3,4,5].map(i => (
                            <button
                              type="button"
                              key={i}
                              onClick={() => setRating(i)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-200"} size={32} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all resize-none"
                        rows={4}
                        placeholder="Chia sẻ cảm nhận của bạn về khóa học này..."
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        required
                      />
                      <Button 
                        type="submit" 
                        disabled={rating === 0 || feedback.trim() === ""} 
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Gửi đánh giá
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 