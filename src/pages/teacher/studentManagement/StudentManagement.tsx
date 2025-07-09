import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  UserPlus, Edit, Trash2, Search, GraduationCap, UserCheck, UserX, Loader2, Eye } from "lucide-react";
import { Pagination } from '../../../components/ui/pagination';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleUserService } from '../../../services';

interface Student {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  profile: {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    avatar?: string;
  };
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });
  const navigate = useNavigate();

  // Load students from API
  const loadStudents = async (page = 1, search = '') => {
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
      
      console.log('Loading students with params:', params);
      const response = await simpleUserService.getStudents(params);
      
      console.log('Students API response:', response);
      
      if (response.students) {
        setStudents(response.students);
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
      console.error('Error loading students:', error);
      setError(error.message || 'Lỗi khi tải danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudents(1, searchTerm);
  };

  const filteredStudents = students.filter(student => {
    if (!searchTerm.trim()) return true;
    const fullName = `${student.profile?.first_name || ''} ${student.profile?.last_name || ''}`.toLowerCase();
    const studentId = student.profile?.student_id?.toLowerCase() || '';
    const email = student.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || studentId.includes(search) || email.includes(search);
  });

  const activeStudents = students.filter(s => s.is_active).length;
  const inactiveStudents = students.filter(s => !s.is_active).length;

  const handleDelete = async (id: number) => {
    const student = students.find(s => s.id === id);
    const fullName = student?.profile ? `${student.profile.first_name} ${student.profile.last_name}` : student?.email;
    const confirmMessage = `Bạn có chắc chắn muốn xóa sinh viên "${fullName}" không?\n\nHành động này sẽ vô hiệu hóa tài khoản và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await simpleUserService.deleteStudent(id);
        
        // Show success message
        alert(`Đã xóa sinh viên "${fullName}" thành công!`);
        
        // Reload students list
        loadStudents(pagination.page, searchTerm);
      } catch (error: any) {
        console.error('Delete student error:', error);
        alert(`Lỗi khi xóa sinh viên: ${error.message}`);
        setLoading(false);
      }
    }
  };

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
    const fullName = student.profile ? `${student.profile.first_name} ${student.profile.last_name}` : 'Chưa cập nhật tên';
    const studentId = student.profile?.student_id || 'N/A';
    
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/teacher/students/${student.id}`)}
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-4 shadow-lg flex-shrink-0">
                <GraduationCap className="text-white w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-2xl text-gray-800 mb-3 line-clamp-2">
                  {fullName}
                </h3>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                    {studentId}
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    student.is_active 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {student.is_active ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1.5" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4 mr-1.5" />
                        Khóa
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Info */}
            {/* <div className="space-y-4 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="font-medium truncate">{student.email}</span>
              </div>
              
              {student.profile?.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="w-5 h-5 text-indigo-500 flex-shrink-0">📞</span>
                  <span className="font-medium">{student.profile.phone}</span>
                </div>
              )}
              
              {student.profile?.date_of_birth && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="w-5 h-5 text-indigo-500 flex-shrink-0">🎂</span>
                  <span className="font-medium">
                    {new Date(student.profile.date_of_birth).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span className="w-5 h-5 text-indigo-500 flex-shrink-0">📅</span>
                <span className="font-medium">
                  Tham gia: {new Date(student.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div> */}
              
              {/* Quick stats placeholder */}
              {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">-</div>
                    <div className="text-xs text-gray-600">Lớp đang học</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">-</div>
                    <div className="text-xs text-gray-600">Điểm TB</div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-gray-100 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 font-medium py-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/teacher/students/${student.id}`);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" /> Chi tiết
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium py-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/teacher/students/${student.id}/edit`);
                  }}
                >
                  <Edit className="w-3 h-3 mr-1" /> Sửa
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium py-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(student.id);
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
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý sinh viên</h1>
                <p className="text-blue-100 text-lg">Quản lý thông tin tất cả sinh viên trong hệ thống</p>
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
                  onClick={() => navigate('/teacher/students/add')}
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
              onClick={() => loadStudents()} 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p)=>loadStudents(p, searchTerm)} />
          </div>
        )}

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sinh viên nào</h3>
              <p className="text-gray-500">Các sinh viên sẽ xuất hiện ở đây</p>
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
      </div>
    </div>
  );
};

export default StudentManagement; 
