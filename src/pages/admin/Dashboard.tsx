import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Users, BookOpen, Award, TrendingUp, Plus, Settings, BarChart3, UserPlus, GraduationCap } from "lucide-react"
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
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  🏛️ Admin Dashboard
                </h1>
                <p className="text-blue-100 text-lg">Chào mừng {user?.userName || user?.email}, quản lý hệ thống LMS của bạn</p>
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

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalUsers}</div>
                <div className="text-gray-600 text-sm">Tổng người dùng</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalTeachers}</div>
                <div className="text-gray-600 text-sm">Giảng viên</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                <div className="text-gray-600 text-sm">Sinh viên</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalCourses}</div>
                <div className="text-gray-600 text-sm">Khóa học</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</div>
                <div className="text-gray-600 text-sm">Quiz</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalClasses}</div>
                <div className="text-gray-600 text-sm">Lớp học</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">👥 Quản lý người dùng</h3>
              <Button onClick={() => navigate('/admin/users')} variant="outline" size="sm">
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/admin/teachers/add')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Thêm giảng viên mới
              </Button>
              <Button 
                onClick={() => navigate('/admin/users')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Quản lý tài khoản
              </Button>
              <Button 
                onClick={() => navigate('/admin/roles')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Quản lý vai trò
              </Button>
            </div>
          </div>

          {/* System Management */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">⚙️ Quản lý hệ thống</h3>
              <Button onClick={() => navigate('/admin/statistics')} variant="outline" size="sm">
                Xem báo cáo
              </Button>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/admin/courses')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Quản lý khóa học
              </Button>
              <Button 
                onClick={() => navigate('/admin/quiz')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Quản lý Quiz
              </Button>
              <Button 
                onClick={() => navigate('/admin/statistics')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Thống kê & Báo cáo
              </Button>
            </div>
                    </div>
                  </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{stats.totalUsers} người dùng trong hệ thống</p>
                  <p className="text-sm text-gray-600">Bao gồm {stats.totalTeachers} giảng viên và {stats.totalStudents} sinh viên</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-medium">Hôm nay</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{stats.totalCourses} khóa học đang hoạt động</p>
                  <p className="text-sm text-gray-600">Hệ thống đang quản lý các khóa học</p>
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium">Cập nhật</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                  </div>
                <div>
                  <p className="font-medium text-gray-800">{stats.totalQuizzes} quiz đã được tạo</p>
                  <p className="text-sm text-gray-600">Các bài kiểm tra trực tuyến</p>
                </div>
              </div>
              <span className="text-xs text-orange-600 font-medium">Tổng cộng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}