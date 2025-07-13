import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, XCircle, Users, Edit, Trash2, Search, GraduationCap, Calendar, Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { authService } from '../../../services/auth.service';
import  {simpleClassService}  from '../../../services/class.service.simple';

const TeacherClasses: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (!currentUser.role || !['admin', 'lecturer'].includes(currentUser.role)) {
        setError('Bạn không có quyền truy cập chức năng này');
        return;
      }

      let response;
      if(currentUser.role==='admin'){
        try {
          const profile = await simpleClassService.getCurrentLecturerProfile();
          response = await simpleClassService.getClasses({ lecturer_id: profile.lecturer_id, limit: 100 });
        } catch {
          response = await simpleClassService.getClasses({ limit: 100 });
        }
      } else {
        response = await simpleClassService.getMyClasses();
      }
      let classesData = response.data || [];
      
      if (classesData && classesData.length > 0) {
        const processedClasses = classesData.map((classItem: any) => ({
          id: classItem.id,
          name: classItem.section_name || 'Chưa có tên',
          description: classItem.schedule || 'Chưa có mô tả',
          course: classItem.subject?.subject_name || 'Chưa có môn học',
          courseCode: classItem.subject?.subject_code || '',
          room: classItem.room || '',
          maxStudents: classItem.max_students || 0,
          enrollmentCount: classItem.enrollmentCount || 0,
          startDate: classItem.start_date || '',
          endDate: classItem.end_date || '',
          schedule: classItem.schedule || '',
          status: true, // Default to active for now
          createdAt: classItem.created_at || new Date().toISOString(),
          lecturerName: classItem.lecturer ? `${classItem.lecturer.first_name} ${classItem.lecturer.last_name}` : ''
        }));
        
        setClasses(processedClasses);
      } else {
        setClasses([]);
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      
      if (error.message.includes('Token expired') || error.message.includes('Unauthorized')) {
        setError('Phiên đăng nhập đã hết hạn. Đang chuyển hướng...');
        setTimeout(() => {
          authService.logout();
        }, 2000);
      } else {
        setError('Không thể tải danh sách lớp học phần: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClasses = classes.filter(c => c.status).length;
  const inactiveClasses = classes.filter(c => !c.status).length;

  const handleDelete = async (classId: number) => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;

    if (deletingClassId !== null) {
      alert('Vui lòng đợi quá trình xóa hiện tại hoàn thành');
      return;
    }

    try {
      const studentsResponse = await simpleClassService.getClassStudents(classId);
      
      if (studentsResponse.data && studentsResponse.data.length > 0) {
        const confirmMessage = `Lớp học phần "${classItem.name}" có ${studentsResponse.data.length} sinh viên đang học.\n\nBạn cần xóa tất cả sinh viên khỏi lớp trước khi có thể xóa lớp học phần.\n\nBạn có muốn chuyển đến trang quản lý sinh viên không?`;
        
        if (window.confirm(confirmMessage)) {
          navigate(`/teacher/classes/${classId}/students`);
        }
        return;
      }

      const confirmMessage = `Bạn có chắc chắn muốn xóa lớp học phần "${classItem.name}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
        setDeletingClassId(classId);
        
        await simpleClassService.deleteClass(classId);
        
        setClasses(classes.filter((c) => c.id !== classId));
        alert("Đã xóa lớp học phần thành công!");
        
        fetchMyClasses();
    }
    } catch (error: any) {
      console.error('Error deleting class:', error);
      
      let errorMessage = 'Lỗi khi xóa lớp học phần: ';
      if (error.message.includes('Cannot delete class with enrolled students')) {
        errorMessage = `Không thể xóa lớp học phần "${classItem.name}"!\n\nLớp học phần này vẫn còn có sinh viên đang học. Vui lòng xóa tất cả sinh viên khỏi lớp trước khi xóa lớp học phần.`;
      } else {
        errorMessage += (error.message || 'Vui lòng thử lại');
      }
      
      alert(errorMessage);
    } finally {
      setDeletingClassId(null);
    }
  };

  const ClassCard: React.FC<{ classItem: any }> = ({ classItem }) => {
    return (
      <Card className="h-full flex flex-col shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden group w-full max-w-[380px] m-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <CardContent className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2">
                {classItem.name}
              </h3>
              
              {/* Course and Status in separate rows for better spacing */}
              <div className="space-y-2">
                <div className="flex justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {classItem.course} {classItem.courseCode && `(${classItem.courseCode})`}
                  </span>
                </div>
                <div className="flex justify-start">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    classItem.status 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {classItem.status ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        Khóa
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Class Info */}
          <div className="space-y-3 mb-4">
            {classItem.room && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="font-medium">Phòng: {classItem.room}</span>
              </div>
            )}
            {classItem.enrollmentCount !== undefined && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-medium">{classItem.enrollmentCount}/{classItem.maxStudents} sinh viên</span>
              </div>
            )}
            {user?.role === 'admin' && classItem.lecturerName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="font-medium">GV: {classItem.lecturerName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="font-medium">Ngày tạo: {new Date(classItem.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {classItem.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 gap-2">
              {/* First row - Main action */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 font-medium"
                onClick={() => navigate(`/teacher/classes/${classItem.id}/students`)}
              >
                <Users className="w-4 h-4 mr-2" /> Quản lý Sinh viên
              </Button>
              
              {/* Second row - Edit and Delete */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                  onClick={() => navigate(`/teacher/my-classes/edit/${classItem.id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Sửa
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                  onClick={() => handleDelete(classItem.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Xóa
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">
                {user?.role === 'admin' 
                  ? 'Đang tải danh sách lớp học phần...' 
                  : 'Đang tải danh sách lớp học phần của bạn...'
                }
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
                <Button 
                  onClick={fetchMyClasses}
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

        {/* Main Content - Only show when not loading */}
        {!loading && (
          <>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  {user?.role === 'admin' ? 'Quản lý lớp học phần' : 'Lớp học phần của tôi'}
                </h1>
                <p className="text-blue-100 text-lg">
                  Chào mừng <span className="font-semibold">{user?.userName || user?.email}</span>, 
                  {user?.role === 'admin' 
                    ? ' quản lý tất cả lớp học phần trong hệ thống' 
                    : ' quản lý các lớp học phần bạn đang phụ trách'
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{classes.length}</div>
                    <div className="text-blue-100 text-sm">Tổng lớp học phần</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{activeClasses}</div>
                    <div className="text-blue-100 text-sm">Hoạt động</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{inactiveClasses}</div>
                    <div className="text-blue-100 text-sm">Khóa</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                    onClick={() => navigate('/teacher/my-classes/add')}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm lớp học phần
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học phần theo tên, mô tả hoặc môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClasses.map((classItem) => (
            <ClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? "Không tìm thấy lớp học phần nào" : "Chưa có lớp học phần nào"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? "Thử thay đổi từ khóa tìm kiếm" 
                  : user?.role === 'admin' 
                    ? "Hệ thống chưa có lớp học phần nào được tạo"
                    : "Bạn chưa được phân công phụ trách lớp học phần nào"
                }
              </p>
              {!searchTerm && (
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 rounded-xl"
                  onClick={() => navigate('/teacher/classes')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Xem tất cả lớp học phần
                </Button>
              )}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;
