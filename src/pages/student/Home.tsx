import { Button } from "../../components/ui/button"
import { Plus, BookOpen, Users, TrendingUp, Bell, Calendar, Clock, Award, ChevronRight, CheckCircle, XCircle } from "lucide-react"
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
      color: "from-blue-400 to-blue-600",
      completed: true,
      nextClass: "Thứ 2, 8:00 AM"
    },
    {
      id: "2",
      title: "Data Structures",
      description: "CS201 - Section B",
      teacher: "Jane Smith",
      studentsCount: 28,
      color: "from-green-400 to-green-600",
      completed: false,
      nextClass: "Thứ 3, 10:00 AM"
    },
    {
      id: "3",
      title: "Database Systems",
      description: "CS301 - Section C",
      teacher: "Alice Brown",
      studentsCount: 32,
      color: "from-purple-400 to-purple-600",
      completed: true,
      nextClass: "Thứ 5, 2:00 PM"
    }
  ];

  // Thống kê tổng quan
  const progress = 68; // % tiến độ học tập mẫu
  const totalAssignments = 12;
  const completedAssignments = 8;
  const completedClasses = classes.filter(cls => cls.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header chào mừng */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Chào mừng bạn trở lại! 👋</h1>
                <p className="text-blue-100 text-lg">Hôm nay là một ngày tuyệt vời để học tập. Hãy tiếp tục hành trình tri thức của bạn!</p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-3xl font-bold">{new Date().getDate()}</div>
                <div className="text-blue-100 text-sm">
                  {new Date().toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
      </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{classes.length}</div>
                <div className="text-gray-600 text-sm">Lớp đang tham gia</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{completedClasses}/{classes.length}</div>
                <div className="text-gray-600 text-sm">Lớp đã hoàn thành</div>
              </div>
            </div>
      </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{completedAssignments}/{totalAssignments}</div>
                <div className="text-gray-600 text-sm">Bài tập hoàn thành</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">3</div>
                <div className="text-gray-600 text-sm">Lớp học tuần này</div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách lớp học */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Lớp học của bạn</h2>
            <Button 
              onClick={() => navigate('/student/classes')} 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg px-6 py-3 rounded-xl"
            >
              Xem tất cả
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div 
                key={cls.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/course/${cls.id}`)}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  {/* Header với gradient */}
                  <div className={`h-32 bg-gradient-to-br ${cls.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 p-6 flex items-center justify-between h-full">
                      <div>
                        <h3 className="font-bold text-xl text-white mb-1">{cls.title}</h3>
                        <p className="text-white/80 text-sm">{cls.description}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-white/60" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Trạng thái</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          cls.completed 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {cls.completed ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã hoàn thành
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Đang học
                            </>
                          )}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{cls.studentsCount} sinh viên</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">GV:</span>
                          <span>{cls.teacher}</span>
                        </div>
                        {!cls.completed && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span>Lớp tiếp theo: {cls.nextClass}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}