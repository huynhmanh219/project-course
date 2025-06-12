import { Button } from "../../components/ui/button"
import { Plus, BookOpen, Users, TrendingUp, Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ClassCard } from "../../components/home/ClassCard"

export function Home() {
  const navigate = useNavigate();
  // Mock data cho các lớp học
  const classes = [
    {
      id: "1",
      title: "Web Development",
      description: "CS101 - Section A",
      teacher: "John Doe",
      studentsCount: 30,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: "2",
      title: "Data Structures",
      description: "CS201 - Section B",
      teacher: "Jane Smith",
      studentsCount: 28,
      color: "from-green-400 to-green-600"
    },
    {
      id: "3",
      title: "Database Systems",
      description: "CS301 - Section C",
      teacher: "Alice Brown",
      studentsCount: 32,
      color: "from-purple-400 to-purple-600"
    }
  ];
  // Thống kê tổng quan
  const progress = 68; // % tiến độ học tập mẫu
  const notifications = [
    { id: 1, content: "Bạn có 1 bài tập sắp đến hạn nộp trong lớp Web Development.", time: "2 giờ trước" },
    { id: 2, content: "Lớp Data Structures đã đăng thông báo mới.", time: "1 ngày trước" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header chào mừng */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 mb-2">Chào mừng bạn trở lại! 👋</h1>
            <p className="text-gray-500 text-lg">Chúc bạn một ngày học tập hiệu quả và nhiều niềm vui.</p>
          </div>
          {/* <Button onClick={() => navigate('/student/classes')} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Tham gia lớp học
          </Button> */}
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 flex flex-col items-center shadow-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <BookOpen className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{classes.length}</div>
            <div className="mt-1 text-lg font-medium">Lớp đang tham gia</div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col items-center shadow-xl bg-gradient-to-br from-green-400 to-green-600 text-white">
            <TrendingUp className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{progress}%</div>
            <div className="mt-1 text-lg font-medium">Tiến độ học tập</div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col items-center shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white">
            <Bell className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{notifications.length}</div>
            <div className="mt-1 text-lg font-medium">Thông báo mới</div>
          </div>
        </div>

        {/* Danh sách lớp học */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Lớp học của bạn</h2>
            {/* <Button onClick={() => navigate('/student/classes')} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Tham gia lớp học
            </Button> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <div key={cls.id} className="group">
                <div className={`h-28 rounded-2xl mb-4 bg-gradient-to-br ${cls.color} shadow-lg group-hover:scale-105 transition-transform duration-200 flex items-center justify-center`}> 
                  <BookOpen className="w-10 h-10 text-white opacity-80" />
                </div>
                <div
                  className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-2 group-hover:shadow-2xl transition-shadow duration-200 cursor-pointer border-0"
                  onClick={() => navigate(`/course/${cls.id}`)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-blue-900 flex-1 truncate">{cls.title}</h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{cls.description}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{cls.studentsCount} sinh viên</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium">GV:</span>
                    <span>{cls.teacher}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông báo mới nhất */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2"><Bell className="w-6 h-6 text-yellow-500" /> Thông báo mới nhất</h2>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-gray-500">Không có thông báo nào.</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-5 border rounded-2xl bg-white flex justify-between items-center shadow hover:bg-yellow-50 transition">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="font-medium text-gray-800">{n.content}</div>
                      <div className="text-xs text-gray-500 mt-1">{n.time}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}