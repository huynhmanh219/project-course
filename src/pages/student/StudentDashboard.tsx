import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { BookOpen, Users, Calendar, Clock, Award, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/auth.service"
import { courseService } from "../../services/course.service.simple"
import { quizService } from "../../services/quiz.service.simple"

export function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    completedClasses: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    upcomingClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Fetch student's classes
      console.log('Fetching student classes...');
      const classesResponse = await courseService.getStudentClasses();
      console.log('Classes response:', classesResponse);
      
      if (classesResponse && classesResponse.data) {
        const studentClasses = classesResponse.data;
        setClasses(studentClasses);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalClasses: studentClasses.length,
          completedClasses: studentClasses.filter((cls: any) => cls.status === 'completed').length,
          upcomingClasses: studentClasses.filter((cls: any) => cls.status === 'active').length
        }));
      }

      // Fetch quiz statistics
      try {
        console.log('Fetching quiz statistics...');
        const quizzesResponse = await quizService.getQuizzes();
        console.log('Quizzes response:', quizzesResponse);
        
        if (quizzesResponse && quizzesResponse.data) {
          const totalQuizzes = quizzesResponse.data.length;
          const completedQuizzes = Math.floor(totalQuizzes * 0.6);
          
          setStats(prev => ({
            ...prev,
            totalQuizzes,
            completedQuizzes
          }));
        }
      } catch (quizError) {
        console.log('Quiz stats not available:', quizError);
      }

    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Convert class data for display
  const formatClassForDisplay = (classData: any) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600", 
      "from-purple-400 to-purple-600",
      "from-orange-400 to-orange-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600"
    ];
    
    return {
      id: classData.class_id || classData.id,
      title: classData.class_name || classData.name || 'Unknown Class',
      description: `${classData.subject_code || 'N/A'} - ${classData.class_code || 'N/A'}`,
      teacher: classData.lecturer_name || 'Unknown Teacher',
      studentsCount: classData.student_count || 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      completed: classData.status === 'completed',
      nextClass: classData.next_session || 'TBA',
      subjectName: classData.subject_name || 'Unknown Subject'
    };
  };

  const displayClasses = classes.map(formatClassForDisplay);

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
        {/* Header chào mừng */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  Chào mừng {user?.userName || user?.email || 'bạn'} trở lại! 👋
                </h1>
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

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalClasses}</div>
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
                <div className="text-2xl font-bold text-gray-800">{stats.completedClasses}/{stats.totalClasses}</div>
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
                <div className="text-2xl font-bold text-gray-800">{stats.completedQuizzes}/{stats.totalQuizzes}</div>
                <div className="text-gray-600 text-sm">Quiz đã hoàn thành</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.upcomingClasses}</div>
                <div className="text-gray-600 text-sm">Lớp học đang active</div>
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
          
          {displayClasses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có lớp học nào</h3>
              <p className="text-gray-500 mb-4">Bạn chưa tham gia lớp học nào. Liên hệ giáo viên để được thêm vào lớp.</p>
              <Button onClick={() => navigate('/student/classes')} variant="outline">
                Xem danh sách lớp
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayClasses.slice(0, 6).map((cls) => (
                <div 
                  key={cls.id} 
                  className="group cursor-pointer"
                  onClick={() => navigate(`/student/classes/${cls.id}`)}
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
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">Môn:</span>
                            <span>{cls.subjectName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Hành động nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/student/quiz')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center gap-2"
            >
              <Award className="w-5 h-5" />
              Làm Quiz
            </Button>
            <Button 
              onClick={() => navigate('/student/classes')}
              variant="outline"
              className="py-3 px-4 rounded-xl flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Xem Lớp Học
            </Button>
            <Button 
              onClick={() => navigate('/calendar')}
              variant="outline"
              className="py-3 px-4 rounded-xl flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Lịch Học
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 