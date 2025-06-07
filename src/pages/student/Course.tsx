import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { AnnouncementCard } from "../../components/course/AnnouncementCard";
import { AssignmentCard } from "../../components/course/AssignmentCard";
import { Button } from "../../components/ui/button";
import { Star } from "lucide-react";

export function Course() {
  // Dữ liệu mẫu
  const course = {
    id: 1,
    name: "Lập trình Web",
    code: "CS101",
    section: "A",
    teacher: "Nguyễn Văn A",
    description: "Khóa học về HTML, CSS, JavaScript và framework hiện đại.",
    progress: 75, // % tiến độ học tập
  };
  const announcements = [
    {
      id: 1,
      title: "Chào mừng đến với lớp học!",
      content: "Hãy đọc kỹ tài liệu và chuẩn bị cho buổi học đầu tiên.",
      time: "2 ngày trước",
      author: "Nguyễn Văn A",
    },
    {
      id: 2,
      title: "Nộp bài tập 1",
      content: "Hạn nộp bài tập 1 là ngày 15/06/2024.",
      time: "1 ngày trước",
      author: "Nguyễn Văn A",
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
      { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@univ.edu" },
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
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-1">{course.name}</h1>
          <div className="text-gray-600 mb-1">Mã lớp: {course.code} - Phần: {course.section}</div>
          <div className="text-gray-600 mb-1">Giảng viên: <span className="font-semibold text-gray-800">{course.teacher}</span></div>
          <div className="text-gray-500 text-sm">{course.description}</div>
        </div>
        <div className="w-full md:w-60">
          <div className="mb-1 text-sm text-gray-700 font-medium">Tiến độ học tập</div>
          <Progress value={course.progress} />
          <div className="text-right text-xs text-gray-500 mt-1">{course.progress}% hoàn thành</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stream" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger
            value="stream"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-100 text-blue-700 font-semibold rounded px-4 py-2 transition"
          >
            Thông báo
          </TabsTrigger>
          <TabsTrigger
            value="classwork"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-100 text-blue-700 font-semibold rounded px-4 py-2 transition"
          >
            Bài tập & Tài liệu
          </TabsTrigger>
          <TabsTrigger
            value="people"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-100 text-blue-700 font-semibold rounded px-4 py-2 transition"
          >
            Mọi người
          </TabsTrigger>
          <TabsTrigger
            value="grades"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-100 text-blue-700 font-semibold rounded px-4 py-2 transition"
          >
            Điểm số
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-100 text-blue-700 font-semibold rounded px-4 py-2 transition"
          >
            Đánh giá khóa học
          </TabsTrigger>
        </TabsList>

        {/* Tab Thông báo */}
        <TabsContent value="stream" className="space-y-3">
          {announcements.length === 0 ? (
            <div className="text-gray-500">Chưa có thông báo nào.</div>
          ) : (
            announcements.map(a => (
              <AnnouncementCard
                key={a.id}
                title={a.title}
                content={a.content}
                time={a.time}
                author={a.author}
              />
            ))
          )}
        </TabsContent>

        {/* Tab Bài tập & Tài liệu */}
        <TabsContent value="classwork" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Bài tập</h2>
            {assignments.length === 0 ? (
              <div className="text-gray-500">Chưa có bài tập nào.</div>
            ) : (
              <div className="space-y-3">
                {assignments.map(a => (
                  <div key={a.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-800">{a.title}</div>
                      <div className="text-sm text-gray-500">Hạn nộp: {a.due}</div>
                      <div className="text-xs mt-1">Trạng thái: <span className={a.status === "Đã nộp" ? "text-green-600" : "text-red-500"}>{a.status}</span></div>
                    </div>
                    <div className="flex gap-2 items-center mt-2 md:mt-0">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">Xem chi tiết</Button>
                      {a.status === "Chưa nộp" && <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">Nộp bài</Button>}
                      {a.grade !== null && <span className="text-sm text-orange-600 font-semibold">Điểm: {a.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Tài liệu</h2>
            {materials.length === 0 ? (
              <div className="text-gray-500">Chưa có tài liệu nào.</div>
            ) : (
              <ul className="space-y-2">
                {materials.map(m => (
                  <li key={m.id} className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2">
                    <span className="font-medium text-gray-800">{m.name}</span>
                    <span className="text-xs text-gray-500">[{m.type}]</span>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">Tải về</Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        {/* Tab Mọi người */}
        <TabsContent value="people" className="space-y-3">
          <div className="mb-2 text-lg font-semibold text-gray-700">Giảng viên</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {people.teachers.map(t => (
              <div key={t.id} className="flex items-center gap-4 bg-white rounded-lg shadow p-4 w-full">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">{t.name[0]}</div>
                <div>
                  <div className="font-medium text-gray-800">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.email}</div>
                  <div className="text-xs text-purple-600 font-semibold mt-1">Giảng viên</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-2 text-lg font-semibold text-gray-700">Sinh viên</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {people.students.map(s => (
              <div key={s.id} className="flex items-center gap-4 bg-white rounded-lg shadow p-4 w-full">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">{s.name[0]}</div>
                <div>
                  <div className="font-medium text-gray-800">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.email}</div>
                  <div className="text-xs text-blue-600 font-semibold mt-1">Sinh viên</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab Điểm số */}
        <TabsContent value="grades" className="space-y-3">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Bài tập</th>
                  <th className="px-4 py-2 border">Trạng thái</th>
                  <th className="px-4 py-2 border">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {myGrades.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">Chưa có điểm.</td>
                  </tr>
                ) : (
                  myGrades.map((g, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="px-4 py-2 border font-semibold">{g.title}</td>
                      <td className="px-4 py-2 border">{g.status}</td>
                      <td className="px-4 py-2 border">{g.grade ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab Đánh giá khóa học */}
        <TabsContent value="feedback" className="space-y-4 max-w-lg">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700">
              Cảm ơn bạn đã đánh giá khóa học!
              <div className="mt-2 flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} size={20} />
                ))}
              </div>
              <div className="mt-2 text-gray-800 font-medium">"{feedback}"</div>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="bg-white rounded shadow p-4 space-y-3"
            >
              <div className="font-medium text-gray-700">Đánh giá khóa học</div>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i)}
                    className="focus:outline-none"
                  >
                    <Star className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} size={28} />
                  </button>
                ))}
              </div>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Nhận xét của bạn về khóa học..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                required
              />
              <Button type="submit" disabled={rating === 0 || feedback.trim() === ""} className="bg-yellow-400 hover:bg-yellow-500 text-white">Gửi đánh giá</Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 