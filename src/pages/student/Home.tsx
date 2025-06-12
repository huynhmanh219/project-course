import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
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
      color: "bg-blue-500"
    },
    {
      id: "2",
      title: "Data Structures",
      description: "CS201 - Section B",
      teacher: "Jane Smith",
      studentsCount: 28,
      color: "bg-green-500"
    },
    {
      id: "3",
      title: "Database Systems",
      description: "CS301 - Section C",
      teacher: "Alice Brown",
      studentsCount: 32,
      color: "bg-purple-500"
    }
  ];
  // Thống kê tổng quan
  const progress = 68; // % tiến độ học tập mẫu
  const notifications = [
    { id: 1, content: "Bạn có 1 bài tập sắp đến hạn nộp trong lớp Web Development.", time: "2 giờ trước" },
    { id: 2, content: "Lớp Data Structures đã đăng thông báo mới.", time: "1 ngày trước" },
  ];

  return (
    <div className="space-y-6">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 rounded-lg p-5 flex flex-col items-center shadow">
          <div className="text-3xl font-bold text-blue-700">{classes.length}</div>
          <div className="text-gray-700 mt-1">Lớp đang tham gia</div>
        </div>
        <div className="bg-green-100 rounded-lg p-5 flex flex-col items-center shadow">
          <div className="text-3xl font-bold text-green-700">{progress}%</div>
          <div className="text-gray-700 mt-1">Tiến độ học tập</div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-5 flex flex-col items-center shadow">
          <div className="text-3xl font-bold text-yellow-700">{notifications.length}</div>
          <div className="text-gray-700 mt-1">Thông báo mới</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chào mừng bạn trở lại!</h1>
        {/* <Button onClick={() => navigate('/student/classes')}>
          <Plus className="mr-2 h-4 w-4" />
          Tham gia lớp học
        </Button> */}
      </div>

      {/* Danh sách lớp học */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id}>
            <div className={`h-24 ${cls.color} rounded-lg mb-4`}></div>
            <ClassCard
              id={cls.id}
              title={cls.title}
              description={cls.description}
              teacher={cls.teacher}
              studentsCount={cls.studentsCount}
              onClick={() => navigate(`/course/${cls.id}`)}
            />
          </div>
        ))}
      </div>

      {/* Thông báo mới nhất */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Thông báo mới nhất</h2>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-gray-500">Không có thông báo nào.</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="p-4 border rounded bg-white flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">{n.content}</div>
                  <div className="text-xs text-gray-500 mt-1">{n.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}