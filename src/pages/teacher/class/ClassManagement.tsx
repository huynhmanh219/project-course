import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Edit, Trash2, CheckCircle, XCircle, Plus, Calendar, GraduationCap, User2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { authService } from '../../../services/auth.service';
import { simpleClassService } from '../../../services/class.service.simple';

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
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

      console.log('Fetching classes...');
      const response = await simpleClassService.getClasses();
      console.log('Classes response:', response);
      
     
      let classesData = response.data || [];
      
      console.log('Classes data to process:', classesData);
      
      if (classesData && classesData.length > 0) {
    
        const processedClasses = classesData.map((classItem: any) => ({
          id: classItem.id,
          name: classItem.section_name || 'Chưa có tên',
          description: classItem.schedule || '',
          course: classItem.subject?.subject_name || 'Chưa có môn học',
          courseCode: classItem.subject?.subject_code || '',
          lecturer: classItem.lecturer ? `${classItem.lecturer.first_name} ${classItem.lecturer.last_name}` : 'Chưa phân công',
          room: classItem.room || '',
          maxStudents: classItem.max_students || 0,
          enrollmentCount: classItem.enrollmentCount || 0,
          startDate: classItem.start_date || '',
          endDate: classItem.end_date || '',
          schedule: classItem.schedule || '',
          status: true, 
          createdAt: classItem.created_at || new Date().toISOString()
        }));
        
        console.log('Processed classes:', processedClasses);
        setClasses(processedClasses);
      } else {
        console.log('No classes found');
        setClasses([]);
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      setError('Không thể tải danh sách lớp học phần');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId: number) => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;

    if (deletingClassId !== null) {
      alert('Vui lòng đợi quá trình xóa hiện tại hoàn thành');
      return;
    }

    try {
      console.log('Checking students for class:', classId);
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
        console.log('Deleting class:', classId);
        
       
        await simpleClassService.deleteClass(classId);
        
       
        setClasses(classes.filter((c) => c.id !== classId));
        alert("Đã xóa lớp học phần thành công!");
        
       
        fetchClasses();
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

  const ClassCard: React.FC<{ cls: any }> = ({ cls }) => {
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
        
        >
         
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
          
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <Users className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {cls.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    cls.status 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {cls.status ? (
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

           
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">{cls.course}</span>
                {cls.courseCode && <span className="text-xs text-gray-400">({cls.courseCode})</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{cls.lecturer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{cls.enrollmentCount}/{cls.maxStudents} sinh viên</span>
              </div>
              {cls.room && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Phòng: {cls.room}</span>
                </div>
              )}
            </div>

           
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {cls.description}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teacher/my-classes/edit/${cls.id}`);
                }}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                disabled={deletingClassId === cls.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(cls.id);
                }}
              >
                {deletingClassId === cls.id ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 mr-1" /> Xóa
                  </>
                )}
              </Button>
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
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Đang tải danh sách lớp học phần...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCount = classes.filter(cls => cls.status).length;
  const inactiveCount = classes.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý lớp học phần</h1>
                <p className="text-blue-100 text-lg">
                  Chào mừng {user?.userName || user?.email}, quản lý các lớp học phần của bạn
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
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <div className="text-blue-100 text-sm">Tổng lớp học phần</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/my-classes/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm lớp học phần
                </Button>
                {/* <Button
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                    onClick={() => navigate('/teacher/classes/add')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" /> Thêm sinh viên
                  </Button> */}
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
                  onClick={fetchClasses}
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

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có lớp học phần nào
              </h3>
              <p className="text-gray-500">
                Các lớp học phần sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement; 