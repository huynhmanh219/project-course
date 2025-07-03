import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit, Trash2, CheckCircle, XCircle, Plus, Info, Calendar, GraduationCap, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { authService } from "../../../services/auth.service";
import { simpleCourseService as SimpleCourseService } from "../../../services/course.service.simple";

const TeacherCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
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

      // Check if user is admin
      const userRole = currentUser.role || currentUser.roleName;
      setIsAdmin(userRole === 'admin');
      console.log('User role:', userRole, 'Is admin:', userRole === 'admin');

      console.log('Fetching courses...');
      const response = await SimpleCourseService.getCourses();
      console.log('Courses response:', response);
      
      // Backend returns: { status: 'success', data: { courses: [...], pagination: {...} } }
      // Check multiple possible response formats
      let coursesData = [];
      
      if (response && response.data && response.data.courses) {
        // Backend format: response.data.courses
        coursesData = response.data.courses;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Already processed format: response.data
        coursesData = response.data;
      } else if (response && Array.isArray(response)) {
        // Direct array format
        coursesData = response;
      } else {
        console.warn('Unexpected response format:', response);
        coursesData = [];
      }
      
      console.log('Courses data to process:', coursesData);
      
      if (coursesData && coursesData.length > 0) {
        // Process course data
        const processedCourses = coursesData.map((course: any) => ({
          id: course.id || course.subject_id,
          tenKhoaHoc: course.subject_name || course.name || 'Chưa có tên',
          moTa: course.description || course.subject_description || 'Chưa có mô tả',
          maKhoaHoc: course.subject_code || course.code || '',
          ngayBatDau: course.start_date || course.created_at || new Date().toISOString().split('T')[0],
          ngayKetThuc: course.end_date || '',
          trangThai: course.status === 'active' || course.is_active !== false,
          giangVien: course.lecturer?.first_name + ' ' + course.lecturer?.last_name || course.lecturer_name || course.teacher_name || 'Chưa phân công',
          lecturerId: course.lecturer_id || course.lecturer?.id,
          soSinhVien: course.student_count || 0,
          soTinChi: course.credits || course.credit_hours || 3,
          hocKy: course.semester || 'Chưa xác định',
          namHoc: course.academic_year || new Date().getFullYear()
        }));
        
        console.log('Processed courses:', processedCourses);
        setCourses(processedCourses);
      } else {
        console.log('No courses found');
        setCourses([]);
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if user can edit/delete a course
  const canEditCourse = (course: any) => {
    if (isAdmin) return true; // Admin can edit all courses
    
    // Lecturer can only edit courses they are assigned to
    const currentUserId = user?.id;
    const currentLecturerId = user?.lecturerId || user?.lecturer_id;
    
    // Check if current user is the lecturer of this course
    return course.lecturerId === currentUserId || course.lecturerId === currentLecturerId;
  };

  const handleDelete = async (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Prevent deleting if already deleting another course
    if (deletingCourseId !== null) {
      alert('Vui lòng đợi quá trình xóa hiện tại hoàn thành');
      return;
    }

    try {
      setDeletingCourseId(courseId);
      
      // Try to check classes first, but proceed with delete if check fails
      let hasClasses = false;
      let classNames = '';
      
      try {
        console.log('Checking classes for course:', courseId);
        const classes = await SimpleCourseService.getClassesBySubject(courseId);
        
        if (classes && Array.isArray(classes) && classes.length > 0) {
          hasClasses = true;
          classNames = classes.map((cls: any) => cls.section_name || cls.name || 'Chưa có tên').join(', ');
          console.log('Found classes:', classes);
        }
      } catch (checkError: any) {
        console.warn('Error checking classes, proceeding with delete attempt:', checkError);
        // Continue with delete attempt even if class check fails
      }
      
      if (hasClasses) {
        const confirmMessage = `Môn học "${course.tenKhoaHoc}" có lớp học đang hoạt động:\n\n${classNames}\n\nBạn cần xóa tất cả các lớp học này trước khi có thể xóa môn học.\n\nBạn có muốn chuyển đến trang "Quản lý lớp học" để xóa các lớp này không?`;
        
        if (window.confirm(confirmMessage)) {
          navigate('/teacher/classes');
        }
        return;
      }

      // If no classes detected, proceed with delete confirmation
      const confirmMessage = `Bạn có chắc chắn muốn xóa môn học "${course.tenKhoaHoc}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
        console.log('Deleting course:', courseId);
        
        // Call delete API
        await SimpleCourseService.deleteCourse(courseId);
        
        // Remove from local state
        setCourses(courses.filter((c) => c.id !== courseId));
        alert("Đã xóa môn học thành công!");
        
        // Refresh the list to ensure consistency
        fetchCourses();
      }
    } catch (error: any) {
      console.error('Error deleting course:', error);
      
      // Handle specific error messages
      let errorMessage = 'Lỗi khi xóa môn học: ';
      if (error.message.includes('Cannot delete course with active sections')) {
        errorMessage = `Không thể xóa môn học "${course.tenKhoaHoc}"!\n\nMôn học này vẫn còn có lớp học đang hoạt động. Vui lòng xóa tất cả các lớp học trước khi xóa môn học.\n\nBạn có thể vào mục "Quản lý lớp học" để xóa các lớp học liên quan.`;
      } else {
        errorMessage += (error.message || 'Vui lòng thử lại');
      }
      
      alert(errorMessage);
    } finally {
      setDeletingCourseId(null);
    }
  };

  const CourseCard: React.FC<{ course: any }> = ({ course }) => {
    const canEdit = canEditCourse(course);
    
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/teacher/courses/${course.id}`)}
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {course.tenKhoaHoc}
                </h3>
                {course.maKhoaHoc && (
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {course.maKhoaHoc}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    course.trangThai 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {course.trangThai ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Đã khóa
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>
                  {course.hocKy} - {course.namHoc}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>GV: {course.giangVien}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>{course.soTinChi} tín chỉ</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {course.moTa}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              {canEdit ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/teacher/courses/edit/${course.id}`);
                    }}
                  >
                    <Edit className="w-3 h-3 mr-1" /> Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                    disabled={deletingCourseId === course.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(course.id);
                    }}
                  >
                    {deletingCourseId === course.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Đang xóa...
                      </>
                    ) : (
                      <>
                    <Trash2 className="w-3 h-3 mr-1" /> Xóa
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex-1 text-center py-2">
                  <span className="text-sm text-gray-500 italic">
                    <Info className="w-4 h-4 inline mr-1" />
                    Chỉ xem (Không có quyền chỉnh sửa)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách môn học...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCount = courses.filter(course => course.trangThai).length;
  const inactiveCount = courses.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý môn học</h1>
                <p className="text-blue-100 text-lg">
                  Chào mừng {user?.userName || user?.email}, quản lý các môn học của bạn
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <div className="text-blue-100 text-sm">Đang hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveCount}</div>
                  <div className="text-blue-100 text-sm">Đã khóa</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <div className="text-blue-100 text-sm">Tổng môn học</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/courses/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> {isAdmin ? 'Thêm môn học' : 'Tạo môn học'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
                <Button 
                  onClick={fetchCourses}
                  variant="outline"
                  size="sm"
                  className="ml-auto border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Grid */}
        {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có môn học nào
              </h3>
              <p className="text-gray-500 mb-4">
                {isAdmin 
                  ? "Bắt đầu bằng cách tạo môn học đầu tiên" 
                  : "Bắt đầu bằng cách tạo môn học mà bạn phụ trách"
                }
              </p>
              <Button 
                onClick={() => navigate('/teacher/courses/add')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAdmin ? 'Thêm môn học đầu tiên' : 'Tạo môn học đầu tiên'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses; 