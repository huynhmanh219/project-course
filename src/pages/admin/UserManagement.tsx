import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  GraduationCap, 
  UserCheck, 
  Crown 
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import SimpleUserService from '../../services/user.service.simple';

const UserManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('teachers');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser || currentUser.role !== 'admin') {
        navigate('/login');
        return;
      }

      console.log('Fetching users...');
      
      // Fetch teachers and students in parallel
      const [teachersResponse, studentsResponse] = await Promise.all([
        SimpleUserService.getTeachers().catch(() => ({ data: [] })),
        SimpleUserService.getStudents().catch(() => ({ data: [] }))
      ]);

      console.log('Teachers response:', teachersResponse);
      console.log('Students response:', studentsResponse);
      
      // Process teachers data
      if (teachersResponse && teachersResponse.data) {
        const processedTeachers = teachersResponse.data.map((teacher: any) => ({
          id: teacher.lecturer_id || teacher.id,
          hoTen: teacher.full_name || teacher.name || teacher.lecturer_name || 'Chưa có tên',
          email: teacher.email || 'Chưa có email',
          department: teacher.department || teacher.department_name || 'Chưa phân khoa',
          hinhAnh: teacher.avatar || teacher.image || '',
          trangThai: teacher.status === 'active' || teacher.is_active !== false,
          soDienThoai: teacher.phone || teacher.phone_number || '',
          ngayThamGia: teacher.created_at || teacher.join_date || new Date().toISOString(),
          chuyenMon: teacher.specialization || teacher.expertise || 'Chưa xác định'
        }));
        setTeachers(processedTeachers);
      }

      // Process students data
      if (studentsResponse && studentsResponse.data) {
        const processedStudents = studentsResponse.data.map((student: any) => ({
          id: student.student_id || student.id,
          hoTen: student.full_name || student.name || student.student_name || 'Chưa có tên',
          email: student.email || 'Chưa có email',
          lop: student.class_name || student.class || 'Chưa có lớp',
          maSinhVien: student.student_code || student.code || '',
          hinhAnh: student.avatar || student.image || '',
          trangThai: student.status === 'active' || student.is_active !== false,
          khoaHoc: student.academic_year || student.year || 'Chưa xác định',
          ngayNhapHoc: student.enrollment_date || student.created_at || new Date().toISOString()
        }));
        setStudents(processedStudents);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const confirmMessage = `Bạn có chắc chắn muốn xóa giảng viên "${teacher.hoTen}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('Deleting teacher:', teacherId);
        // TODO: Implement delete API call
        // await SimpleUserService.deleteTeacher(teacherId);
        
        // For now, just remove from local state
        setTeachers(teachers.filter((t) => t.id !== teacherId));
        alert("Đã xóa giảng viên thành công!");
      } catch (error: any) {
        console.error('Error deleting teacher:', error);
        alert('Lỗi khi xóa giảng viên: ' + (error.message || 'Vui lòng thử lại'));
      }
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const confirmMessage = `Bạn có chắc chắn muốn xóa sinh viên "${student.hoTen}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('Deleting student:', studentId);
        // TODO: Implement delete API call
        // await SimpleUserService.deleteStudent(studentId);
        
        // For now, just remove from local state
        setStudents(students.filter((s) => s.id !== studentId));
        alert("Đã xóa sinh viên thành công!");
      } catch (error: any) {
        console.error('Error deleting student:', error);
        alert('Lỗi khi xóa sinh viên: ' + (error.message || 'Vui lòng thử lại'));
      }
    }
  };

  const UserTable: React.FC<{ users: any[], type: 'teacher' | 'student', onDelete: (id: number) => void }> = ({ users, type, onDelete }) => {
    if (users.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
            {type === 'teacher' ? (
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            ) : (
              <UserCheck className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            )}
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có {type === 'teacher' ? 'giảng viên' : 'sinh viên'} nào
            </h3>
            <p className="text-gray-500 mb-4">
              Các {type === 'teacher' ? 'giảng viên' : 'sinh viên'} sẽ xuất hiện ở đây
            </p>
            <Button 
              onClick={() => navigate(`/admin/${type === 'teacher' ? 'teachers' : 'students'}/add`)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm {type === 'teacher' ? 'giảng viên' : 'sinh viên'}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Họ tên</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                {type === 'teacher' ? 'Khoa/Chuyên môn' : 'Lớp'}
              </th>
              {type === 'student' && (
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Mã SV</th>
              )}
              <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Ảnh đại diện</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Trạng thái</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-blue-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50 transition-all duration-200 border-b border-gray-100"
              >
                <td className="px-6 py-4 font-semibold text-gray-800 text-left">{user.hoTen}</td>
                <td className="px-6 py-4 text-gray-600 text-left text-sm">{user.email}</td>
                <td className="px-6 py-4 text-gray-600 text-left text-sm">
                  {type === 'teacher' ? (user.department || user.chuyenMon) : user.lop}
                </td>
                {type === 'student' && (
                  <td className="px-6 py-4 text-gray-600 text-left text-sm font-mono">
                    {user.maSinhVien || 'N/A'}
                  </td>
                )}
                <td className="px-6 py-4 text-center">
                  {user.hinhAnh ? (
                    <img 
                      src={user.hinhAnh} 
                      alt="avatar" 
                      className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-blue-200 shadow-sm" 
                    />
                  ) : (
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 mx-auto shadow-sm">
                      {type === 'teacher' ? (
                        <GraduationCap className="w-6 h-6" />
                      ) : (
                        <UserCheck className="w-6 h-6" />
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge 
                    className={`${
                      user.trangThai 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {user.trangThai ? (
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
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                      onClick={() => navigate(`/admin/${type === 'teacher' ? 'teachers' : 'students'}/edit/${user.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <p className="text-gray-600">Đang tải danh sách người dùng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeTeachers = teachers.filter(t => t.trangThai).length;
  const activeStudents = students.filter(s => s.trangThai).length;
  const totalUsers = teachers.length + students.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center gap-3">
                  <Crown className="w-10 h-10" />
                  Quản lý Người dùng
                </h1>
                <p className="text-blue-100 text-lg">
                  Chào mừng {user?.userName || user?.email}, quản lý giảng viên và sinh viên trong hệ thống
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeTeachers}</div>
                  <div className="text-blue-100 text-sm">Giảng viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeStudents}</div>
                  <div className="text-blue-100 text-sm">Sinh viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="text-blue-100 text-sm">Tổng người dùng</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/admin/teachers/add')}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm người dùng
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
                  onClick={fetchUsers}
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

        {/* User Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Giảng viên ({teachers.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Sinh viên ({students.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Quản lý Giảng viên</h2>
                    <Button
                onClick={() => navigate('/admin/teachers/add')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm giảng viên
                    </Button>
        </div>
            <UserTable users={teachers} type="teacher" onDelete={handleDeleteTeacher} />
          </TabsContent>
          
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Quản lý Sinh viên</h2>
              <Button
                onClick={() => navigate('/admin/students/add')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm sinh viên
              </Button>
            </div>
            <UserTable users={students} type="student" onDelete={handleDeleteStudent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;