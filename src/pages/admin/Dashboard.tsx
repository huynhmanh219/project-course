import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Users, BookOpen, Award, TrendingUp, Settings, BarChart3, UserPlus, GraduationCap, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/auth.service"
import SimpleUserService from "../../services/user.service.simple"
import SimpleCourseService from "../../services/course.service.simple"
import SimpleQuizService from "../../services/quiz.service.simple"

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    totalClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser || currentUser.role !== 'admin') {
        navigate('/login');
        return;
      }

      // Fetch statistics in parallel
      const [teachersResponse, studentsResponse, coursesResponse, quizzesResponse] = await Promise.all([
        SimpleUserService.getTeachers().catch(() => ({ data: [] })),
        SimpleUserService.getStudents().catch(() => ({ data: [] })),
        SimpleCourseService.getCourses().catch(() => ({ data: [] })),
        SimpleQuizService.getQuizzes().catch(() => ({ data: [] }))
      ]);

      const totalTeachers = teachersResponse.data?.length || 0;
      const totalStudents = studentsResponse.data?.length || 0;
      const totalCourses = coursesResponse.data?.length || 0;
      const totalQuizzes = quizzesResponse.data?.length || 0;

      setStats({
        totalUsers: totalTeachers + totalStudents,
        totalTeachers,
        totalStudents,
        totalCourses,
        totalQuizzes,
        totalClasses: 0 // Will need separate API
      });

    } catch (error: any) {
      console.error('Admin dashboard error:', error);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Đang tải dashboard</h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Trang chủ quản trị viên
                  </h1>
                </div>
                <p className="text-blue-100 text-base sm:text-lg">
                  Chào mừng <span className="font-semibold">{user?.userName || user?.email}</span>, quản lý hệ thống LMS
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold">{new Date().getDate()}</div>
                  <div className="text-blue-100 text-xs sm:text-sm">
                    Tháng {new Date().getMonth() + 1}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm sm:text-base">
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}
                  </div>
                  <div className="text-blue-100 text-xs sm:text-sm">
                    {new Date().toLocaleDateString('vi-VN', { 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold">Có lỗi xảy ra</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalUsers}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Tổng người dùng</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalTeachers}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Giảng viên</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Sinh viên</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalCourses}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Môn học</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Quiz</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalClasses}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Lớp học</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* User Management */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Quản lý người dùng</h3>
              </div>
              <Button 
                onClick={() => navigate('/admin/users')} 
                variant="outline" 
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/teachers/add')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <UserPlus className="w-5 h-5" />
                Thêm giảng viên mới
              </Button>
              <Button 
                onClick={() => navigate('/admin/users')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5" />
                Quản lý tài khoản
              </Button>
              <Button 
                onClick={() => navigate('/admin/roles')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Quản lý vai trò
              </Button>
            </div>
          </div>

          {/* System Management */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Quản lý hệ thống</h3>
              </div>
              <Button 
                onClick={() => navigate('/admin/statistics')} 
                variant="outline" 
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Xem báo cáo
              </Button>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/courses')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                Quản lý môn học
              </Button>
              <Button 
                onClick={() => navigate('/admin/quiz')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Award className="w-5 h-5" />
                Quản lý Quiz
              </Button>
              <Button 
                onClick={() => navigate('/admin/statistics')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Thống kê & Báo cáo
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Hoạt động gần đây</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{stats.totalUsers} người dùng trong hệ thống</p>
                  <p className="text-sm text-gray-600">Bao gồm {stats.totalTeachers} giảng viên và {stats.totalStudents} sinh viên</p>
                </div>
              </div>
              <div className="bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                Hôm nay
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{stats.totalCourses} khóa học đang hoạt động</p>
                  <p className="text-sm text-gray-600">Hệ thống đang quản lý các khóa học</p>
                </div>
              </div>
              <div className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                Cập nhật
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{stats.totalQuizzes} quiz đã được tạo</p>
                  <p className="text-sm text-gray-600">Các bài kiểm tra trực tuyến</p>
                </div>
              </div>
              <div className="bg-orange-200 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                Tổng cộng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}