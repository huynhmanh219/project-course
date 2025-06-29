import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { BookOpen, Users, Award, Plus, Calendar, BarChart3, FileText, PlusCircle, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/auth.service"
import SimpleCourseService from "../../services/course.service.simple"
import SimpleQuizService from "../../services/quiz.service.simple"

export function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    recentQuizzes: 0,
    activeCourses: 0
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
      
      if (!currentUser || (currentUser.role !== 'lecturer' && currentUser.role !== 'admin')) {
        navigate('/login');
        return;
      }

      // Fetch teacher's courses
      const coursesResponse = await SimpleCourseService.getCourses();
      if (coursesResponse && coursesResponse.data) {
        const teacherCourses = coursesResponse.data;
        setCourses(teacherCourses);
        
        // Calculate stats
        const totalStudents = teacherCourses.reduce((sum: number, course: any) => {
          return sum + (course.student_count || 0);
        }, 0);

        setStats(prev => ({
          ...prev,
          totalCourses: teacherCourses.length,
          totalStudents,
          activeCourses: teacherCourses.filter((course: any) => course.status === 'active').length
        }));
      }

      // Fetch quiz statistics
      try {
        const quizzesResponse = await SimpleQuizService.getQuizzes();
        if (quizzesResponse && quizzesResponse.data) {
          const totalQuizzes = quizzesResponse.data.length;
          const recentQuizzes = quizzesResponse.data.filter((quiz: any) => {
            const createdDate = new Date(quiz.created_at);
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return createdDate > lastWeek;
          }).length;
          
          setStats(prev => ({
            ...prev,
            totalQuizzes,
            recentQuizzes
          }));
        }
      } catch (quizError) {
        console.log('Quiz stats not available:', quizError);
      }

    } catch (error: any) {
      console.error('Teacher dashboard error:', error);
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
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  🎓 Teacher Dashboard
                </h1>
                <p className="text-blue-100 text-lg">Chào mừng {user?.userName || user?.email}, quản lý khóa học và sinh viên của bạn</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalCourses}</div>
                <div className="text-gray-600 text-sm">Tổng khóa học</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                <div className="text-gray-600 text-sm">Tổng sinh viên</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</div>
                <div className="text-gray-600 text-sm">Tổng Quiz</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.activeCourses}</div>
                <div className="text-gray-600 text-sm">Khóa học active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.recentQuizzes}</div>
                <div className="text-gray-600 text-sm">Quiz tuần này</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Management */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">📚 Quản lý khóa học</h3>
              <Button onClick={() => navigate('/teacher/courses')} variant="outline" size="sm">
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/teacher/courses/add')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Tạo khóa học mới
              </Button>
              <Button 
                onClick={() => navigate('/teacher/my-classes')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Quản lý lớp học
              </Button>
              <Button 
                onClick={() => navigate('/teacher/students')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Quản lý sinh viên
              </Button>
            </div>
          </div>

          {/* Assessment & Materials */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">📝 Kiểm tra & Tài liệu</h3>
              <Button onClick={() => navigate('/teacher/quiz')} variant="outline" size="sm">
                Xem tất cả
              </Button>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/teacher/quiz/add')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Tạo Quiz mới
              </Button>
              <Button 
                onClick={() => navigate('/teacher/materials')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Quản lý tài liệu
              </Button>
              <Button 
                onClick={() => navigate('/teacher/gradebook')}
                variant="outline"
                className="w-full py-3 rounded-xl flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Sổ điểm
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">📖 Khóa học gần đây</h3>
            <Button onClick={() => navigate('/teacher/courses')} variant="outline" size="sm">
              <span>Xem tất cả</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Chưa có khóa học nào</h4>
              <p className="text-gray-500 mb-4">Bắt đầu bằng cách tạo khóa học đầu tiên của bạn</p>
              <Button onClick={() => navigate('/teacher/courses/add')} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tạo khóa học
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course: any) => (
                <div key={course.id || course.subject_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 truncate">{course.subject_name || course.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {course.subject_code || 'N/A'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{course.student_count || 0} sinh viên</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{course.semester || 'N/A'}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/teacher/courses/${course.id || course.subject_id}`)}
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard; 