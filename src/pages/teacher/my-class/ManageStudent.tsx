// src/pages/TeacherManageStudents.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, UserPlus, Edit, Trash2, CheckCircle, XCircle, Search, GraduationCap, Mail, Phone, UserCheck, UserX, Loader2 } from "lucide-react";
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleCourseService } from '../../../services';

interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  avatar?: string;
  enrollments: Array<{
    enrollment_date: string;
    status: string;
  }>;
  account: {
    id: number;
    email: string;
    is_active: boolean;
  };
}

interface ClassInfo {
  id: number;
  section_name: string;
}

const ManageStudent: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const navigate = useNavigate();

  // Load class students from API
  const loadClassStudents = async (page = 1, search = '') => {
    if (!classId) {
      setError('Không tìm thấy ID lớp học');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params: any = {
        page: page.toString(),
        limit: pagination.limit.toString()
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      console.log(`Loading students for class ${classId} with params:`, params);
      const response = await simpleCourseService.getClassStudents(Number(classId), params);
      
      console.log('Class students API response:', response);
      
      if (response.students) {
        setStudents(response.students);
        setClassInfo(response.class);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages
          });
        }
      } else {
        setError('Không thể tải danh sách sinh viên');
      }
    } catch (error: any) {
      console.error('Error loading class students:', error);
      setError(error.message || 'Lỗi khi tải danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassStudents();
  }, [classId]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadClassStudents(1, searchTerm);
  };

  const filteredStudents = students.filter(student => {
    if (!searchTerm.trim()) return true;
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const studentId = student.student_id.toLowerCase();
    const email = student.account.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || studentId.includes(search) || email.includes(search);
  });

  const activeStudents = students.filter(s => s.account.is_active).length;
  const inactiveStudents = students.filter(s => !s.account.is_active).length;

  const handleRemoveStudent = async (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    const fullName = student ? `${student.first_name} ${student.last_name}` : 'Sinh viên';
    const confirmMessage = `Bạn có chắc chắn muốn xóa sinh viên "${fullName}" khỏi lớp học này không?\n\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await simpleCourseService.removeStudentFromClass(Number(classId), studentId);
        alert("Đã xóa sinh viên khỏi lớp học thành công!");
        loadClassStudents(pagination.page, searchTerm);
      } catch (error: any) {
        alert(`Lỗi khi xóa sinh viên: ${error.message}`);
      }
    }
  };

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
    const fullName = `${student.first_name} ${student.last_name}`;
    
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/teacher/students/${student.account.id}`)}
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm">
                  {student.first_name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {fullName}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {student.student_id}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    student.account.is_active 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {student.account.is_active ? (
                      <>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3 mr-1" />
                        Khóa
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-3 mb-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium truncate">{student.account.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-medium">{student.phone}</span>
                </div>
              )}
              {student.enrollments && student.enrollments.length > 0 && (
                <div className="text-xs text-gray-500">
                  Ghi danh: {new Date(student.enrollments[0].enrollment_date).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teacher/students/edit/${student.account.id}`);
                }}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStudent(student.id);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải danh sách sinh viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  Quản lý sinh viên lớp
                </h1>
                <p className="text-blue-100 text-lg">
                  {classInfo ? `Lớp: ${classInfo.section_name}` : 'Danh sách sinh viên trong lớp học này'}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{pagination.total}</div>
                  <div className="text-blue-100 text-sm">Tổng sinh viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeStudents}</div>
                  <div className="text-blue-100 text-sm">Hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveStudents}</div>
                  <div className="text-blue-100 text-sm">Khóa</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate(`/teacher/classes/${classId}/add-student`)}
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Thêm sinh viên
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={() => loadClassStudents()} 
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên theo tên, MSSV hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="px-6 py-3">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </form>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="default"
              onClick={() => loadClassStudents(pagination.page - 1, searchTerm)}
              disabled={pagination.page <= 1}
            >
              Trước
            </Button>
            <span className="px-4 py-2 bg-white rounded-lg border">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="default"
              onClick={() => loadClassStudents(pagination.page + 1, searchTerm)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Sau
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sinh viên nào</h3>
              <p className="text-gray-500">Lớp học này chưa có sinh viên đăng ký</p>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading && students.length > 0 && filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sinh viên nào</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          </div>
        )}

        {/* Back to Class Management */}
        <div className="flex justify-center">
          <Button
            variant="default"
            onClick={() => navigate('/teacher/my-classes')}
            className="px-6 py-3"
          >
            ← Quay về quản lý lớp học
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudent;