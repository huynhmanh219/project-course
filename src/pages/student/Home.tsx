import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import {  BookOpen, Bell, Calendar, Clock, Award, ChevronRight, CheckCircle, XCircle, AlertTriangle, Play, FileText, Target, Activity } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/auth.service"
import { simpleClassService } from "../../services"
import { Progress } from "../../components/ui/progress"
import SimpleQuizService from "../../services/quiz.service.simple"
import { progressService } from "../../services/progress.service"

interface ClassData {
  id: number;
  courseSection: {
    id: number;
    section_name: string;
    subject: {
      id: number;
      subject_name: string;
      subject_code: string;
      credits: number;
      description?: string;
    };
    lecturer: {
      id: number;
      first_name: string;
      last_name: string;
      title: string;
    };
    status: string;
    start_date: string;
    end_date: string;
  };
  enrollment_date: string;
  status: string;
}

interface RecentActivity {
  id: string;
  type: 'quiz' | 'lecture' | 'material' | 'class';
  title: string;
  description: string;
  timestamp: string;
  classId?: number;
  className?: string;
  icon: any;
  color: string;
}

export function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [sectionProgress, setSectionProgress] = useState<{[key:number]: {completion_rate:number, lectures_completed:number, total_lectures:number}}>({});

  const [stats, setStats] = useState({
    totalClasses: 0,
    completedClasses: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    upcomingClasses: 0,
    totalLectures: 0,
    completedLectures: 0,
    averageGrade: 0,
    lectureCompletionPercent: 0
  });
  const [notifications, setNotifications] = useState<any[]>([]); void notifications;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Fetch student's classes using the correct API
      console.log('Fetching student classes...');
      try {
        const classesResponse = await simpleClassService.getMyStudentClasses();
        console.log('Classes response:', classesResponse);
        
        if (classesResponse && classesResponse.data) {
          const studentClasses = classesResponse.data;
          setClasses(studentClasses);
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalClasses: studentClasses.length,
            completedClasses: studentClasses.filter((cls: ClassData) => cls.status === 'completed').length,
            upcomingClasses: studentClasses.filter((cls: ClassData) => cls.courseSection.status === 'active').length
          }));

          // Fetch lecture progress for each class (courseSection)
          const progressResults = await Promise.all(
            studentClasses.map((cls: any) => progressService.getSectionProgress(cls.courseSection.id))
          );

          let totalLectures = 0;
          let completedLectures = 0;
          const progressMap: {[key:number]: any} = {};

          progressResults.forEach((res, idx) => {
            const sectionId = studentClasses[idx].courseSection.id;
            if (res && res.success && res.data) {
              progressMap[sectionId] = res.data;
              totalLectures += res.data.total_lectures || 0;
              completedLectures += res.data.lectures_completed || 0;
            }
          });

          setSectionProgress(progressMap);

          const lectureCompletionPercent = Math.round((completedLectures / Math.max(totalLectures, 1)) * 100);

          setStats(prev => ({
            ...prev,
            totalLectures,
            completedLectures,
            lectureCompletionPercent
          }));

          // Generate recent activities from classes
          generateRecentActivities(studentClasses);
        }
      } catch (classError) {
        console.error('Error fetching classes:', classError);
        setError('Không thể tải danh sách lớp học');
      }

      // Fetch quiz statistics
      try {
        console.log('Fetching quiz statistics...');
        const quizzesResponse = await SimpleQuizService.getQuizzes();
        console.log('Quizzes response:', quizzesResponse);
        
        if (quizzesResponse && quizzesResponse.data) {
          const totalQuizzes = quizzesResponse.data.length;
          
          // Mock completed quizzes for now - would need separate API
          const completedQuizzes = Math.floor(totalQuizzes * 0.6);
          const averageGrade = 78.5; // Mock average grade
          
          setStats(prev => ({
            ...prev,
            totalQuizzes,
            completedQuizzes,
            averageGrade
          }));
        }
      } catch (quizError) {
        console.log('Quiz stats not available:', quizError);
      }

      // Generate mock notifications
      generateNotifications();

    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivities = (studentClasses: ClassData[]) => {
    const activities: RecentActivity[] = [];
    
    // Generate mock recent activities based on classes
    studentClasses.slice(0, 3).forEach((cls, index) => {
      activities.push({
        id: `activity-${index}`,
        type: 'lecture',
        title: 'Bài giảng mới được thêm',
        description: `Chương 2 - Bài ${index + 1} trong ${cls.courseSection.section_name}`,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
        classId: cls.courseSection.id,
        className: cls.courseSection.section_name,
        icon: Play,
        color: 'text-blue-600'
      });
    });

    // Add quiz activity
    activities.push({
      id: 'quiz-activity',
      type: 'quiz',
      title: 'Quiz mới có sẵn',
      description: 'Quiz Chương 1 - Kiểm tra kiến thức cơ bản',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      icon: Award,
      color: 'text-orange-600'
    });

    // Add material activity
    activities.push({
      id: 'material-activity',
      type: 'material',
      title: 'Tài liệu mới được tải lên',
      description: 'Slide bài giảng và bài tập thực hành',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      icon: FileText,
      color: 'text-green-600'
    });

    setRecentActivities(activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const generateNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'deadline',
        title: 'Sắp đến hạn nộp bài',
        message: 'Bài tập tuần 3 sẽ đến hạn trong 2 ngày',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'quiz',
        title: 'Quiz mới có sẵn',
        message: 'Quiz chương 2 đã được phát hành và có thể làm bài',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'class',
        title: 'Thay đổi lịch học',
        message: 'Lớp Lập trình Web được chuyển từ thứ 3 sang thứ 5',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        priority: 'low'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  // Format time ago
  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };
  void timeAgo;
  // Convert class data for display
  const formatClassForDisplay = (classData: ClassData) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600", 
      "from-purple-400 to-purple-600",
      "from-orange-400 to-orange-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600"
    ];
    
    return {
      id: classData.courseSection.id,
      title: classData.courseSection.section_name,
      description: `${classData.courseSection.subject.subject_code} - ${classData.courseSection.subject.credits} tín chỉ`,
      teacher: `${classData.courseSection.lecturer.title} ${classData.courseSection.lecturer.first_name} ${classData.courseSection.lecturer.last_name}`,
      studentsCount: 0, // Would need separate API call
      color: colors[Math.floor(Math.random() * colors.length)],
      completed: classData.status === 'completed',
      nextClass: 'TBA',
      subjectName: classData.courseSection.subject.subject_name,
      status: classData.courseSection.status,
      enrollmentDate: classData.enrollment_date
    };
  };

  const displayClasses = classes.map(formatClassForDisplay);

  const getSectionPercent = (sectionId:number) => {
    const prog = sectionProgress[sectionId];
    return prog ? Math.round(prog.completion_rate) : 0;
  }

  // Get priority icon for notifications
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Bell className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };
  void getPriorityIcon;
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
                  Chào mừng {user?.userName || user?.first_name || 'bạn'} trở lại! 👋
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

        {/* Thống kê tổng quan nâng cao */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalClasses}</div>
                <div className="text-gray-600 text-sm">Lớp đang tham gia</div>
                <div className="text-xs text-green-600 mt-1">
                  {stats.upcomingClasses} đang active
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.completedQuizzes}/{stats.totalQuizzes}</div>
                <div className="text-gray-600 text-sm">Quiz đã hoàn thành</div>
                <div className="text-xs text-blue-600 mt-1">
                  {stats.averageGrade}% điểm trung bình
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round((stats.completedClasses / Math.max(stats.totalClasses, 1)) * 100)}%
                </div>
                <div className="text-gray-600 text-sm">Tiến độ hoàn thành</div>
                <div className="text-xs text-green-600 mt-1">
                  {stats.completedClasses}/{stats.totalClasses} lớp
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{recentActivities.length}</div>
                <div className="text-gray-600 text-sm">Hoạt động gần đây</div>
                <div className="text-xs text-purple-600 mt-1">
                  Hôm nay
                </div>
              </div>
            </div>
          </div> */}

          {/* Lecture completion */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.lectureCompletionPercent}%</div>
                <div className="text-gray-600 text-sm">Hoàn thành bài giảng</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {stats.completedLectures}/{stats.totalLectures} bài
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Classes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Danh sách lớp học */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Lớp học phần của tôi</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayClasses.slice(0, 4).map((cls) => (
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
                                cls.status === 'completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : cls.status === 'active'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {cls.status === 'completed' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Đã hoàn thành
                                  </>
                                ) : cls.status === 'active' ? (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    Đang học
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    Sắp bắt đầu
                                  </>
                                )}
                              </span>
                            </div>

                            {/* Progress */}
                            <div className="mb-3">
                              <Progress value={getSectionPercent(cls.id)} />
                              <div className="text-xs text-gray-500 text-right mt-1">
                                {sectionProgress[cls.id]?.lectures_completed || 0}/{sectionProgress[cls.id]?.total_lectures || 0} · {getSectionPercent(cls.id)}%
                              </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">GV:</span>
                                <span>{cls.teacher}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Môn:</span>
                                <span>{cls.subjectName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>Tham gia: {new Date(cls.enrollmentDate).toLocaleDateString('vi-VN')}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate('/student/quiz')}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl flex items-center gap-2 justify-center"
                >
                  <Award className="w-5 h-5" />
                  Làm Quiz
                </Button>
                <Button 
                  onClick={() => navigate('/student/classes')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center gap-2 justify-center"
                >
                  <BookOpen className="w-5 h-5" />
                  Xem Lớp Học
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Activities & Notifications */}
          <div className="space-y-6">
            {/* Recent Activities */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => activity.classId && navigate(`/student/classes/${activity.classId}`)}>
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/student/activities')}
              >
                Xem tất cả hoạt động
              </Button>
            </div> */}

            {/* Notifications */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Thông báo
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} 
                       className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                         notification.isRead 
                           ? 'bg-gray-50 border-gray-200' 
                           : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                       }`}>
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(notification.priority)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{timeAgo(notification.timestamp)}</p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/student/notifications')}
              >
                Xem tất cả thông báo
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}