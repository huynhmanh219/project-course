import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  GraduationCap, 
  Crown, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Eye,
  RefreshCw
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import SimpleUserService from '../../services/user.service.simple';
import { Pagination } from '../../components/ui/pagination';

const UserManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  void user;
  const [searchTerm, setSearchTerm] = useState('');
  void setSearchTerm;
  const [statusFilter, setStatusFilter] = useState('all');
  void setStatusFilter;
  const [departmentFilter, setDepartmentFilter] = useState('all');
  void setDepartmentFilter;
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchTeachers(1);
  }, []);

  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser || currentUser.role !== 'admin') {
        navigate('/login');
        return;
      }

      console.log('🔄 Fetching teachers...');
      const params: any = {
        page: page.toString(),
        limit: pagination.limit.toString()
      };
      const teachersData = await SimpleUserService.getTeachers(params);
      
      console.log('📥 Teachers response:', teachersData);
      
      if (teachersData && Array.isArray(teachersData.teachers)) {
        const processedTeachers = teachersData.teachers.map((teacher: any) => ({
          id: teacher.id,
          fullName: `${teacher.profile?.first_name || ''} ${teacher.profile?.last_name || ''}`.trim() || 'Chưa có tên',
          email: teacher.email || 'Chưa có email',
          phone: teacher.profile?.phone || '',
          title: teacher.profile?.title || '',
          department: teacher.profile?.department || 'Chưa phân khoa',
          bio: teacher.profile?.bio || '',
          avatar: teacher.profile?.avatar || '',
          hireDate: teacher.created_at || new Date().toISOString(),
          status: teacher.is_active ? 'active' : 'inactive',
          isActive: teacher.is_active !== false,
          profile: teacher.profile
        }));
        
        console.log('✅ Processed teachers:', processedTeachers);
        setTeachers(processedTeachers);
        if (teachersData.pagination) {
          setPagination({
            page: teachersData.pagination.page,
            limit: teachersData.pagination.limit,
            total: teachersData.pagination.total,
            totalPages: teachersData.pagination.totalPages
          });
        }
      } else {
        console.warn('⚠️ No teachers data received or incorrect format');
        setTeachers([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching teachers:', error);
      
      // Handle token expiration
      if (error.message === 'Token expired.' || error.message.includes('Unauthorized')) {
        setError('Phiên đăng nhập đã hết hạn. Bạn sẽ được chuyển về trang đăng nhập...');
        setTimeout(() => {
          authService.logout();
        }, 2000);
      } else {
        setError('Không thể tải danh sách giảng viên: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const confirmMessage = `⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa giảng viên "${teacher.fullName}" không?\n\n` +
      `Email: ${teacher.email}\n` +
      `Khoa: ${teacher.department}\n\n` +
      `Hành động này sẽ vô hiệu hóa tài khoản giảng viên.`;

    if (window.confirm(confirmMessage)) {
      try {
        console.log('🗑️ Deleting teacher:', teacherId);
        await SimpleUserService.deleteTeacher(teacherId);
        
        // Update local state - remove the teacher from list
        setTeachers(teachers.filter((t) => t.id !== teacherId));
        
        // Show success message
        alert(`✅ Đã xóa giảng viên "${teacher.fullName}" thành công!`);
        
        console.log('✅ Teacher deleted successfully');
      } catch (error: any) {
        console.error('❌ Error deleting teacher:', error);
        
        if (error.message === 'Token expired.' || error.message.includes('Unauthorized')) {
          setError('Phiên đăng nhập đã hết hạn. Bạn sẽ được chuyển về trang đăng nhập...');
          setTimeout(() => {
            authService.logout();
          }, 2000);
        } else {
          alert(`❌ Lỗi khi xóa giảng viên: ${error.message || 'Vui lòng thử lại'}`);
        }
      }
    }
  };

  const handleViewDetails = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedTeacher(null);
    setShowDetailsModal(false);
  };

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && teacher.isActive) ||
                         (statusFilter === 'inactive' && !teacher.isActive);
    const matchesDepartment = departmentFilter === 'all' || teacher.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(teachers.map(t => t.department).filter(d => d && d !== 'Chưa phân khoa'))];
  void departments;
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Đang tải danh sách giảng viên...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeTeachers = teachers.filter(t => t.isActive).length;
  const inactiveTeachers = teachers.filter(t => !t.isActive).length;
  void inactiveTeachers;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-10 h-10" />
                  <h1 className="text-4xl font-bold tracking-tight">Quản lý Giảng viên</h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Chào mừng, quản lý thông tin giảng viên trong hệ thống LMS
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <Card className="bg-white/20 backdrop-blur border-white/30 text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{activeTeachers}</div>
                    <div className="text-blue-100 text-sm">Hoạt động</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/20 backdrop-blur border-white/30 text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{pagination.total}</div>
                    <div className="text-blue-100 text-sm">Tổng số</div>
                  </CardContent>
                </Card>
                {/* <Button
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => navigate('/admin/teachers/add')}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm GV
                </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 border-red-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        {/* <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Tìm kiếm và lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Tất cả khoa</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <Button onClick={fetchTeachers} className="bg-blue-500 hover:bg-blue-600 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Làm mới</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Teachers Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Danh sách giảng viên ({filteredTeachers.length})
            </h2>
            <Button
              onClick={() => navigate('/admin/teachers/add')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm giảng viên
            </Button>
          </div>
          
          {filteredTeachers.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Chưa có giảng viên nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Hãy thêm giảng viên đầu tiên cho hệ thống
                </p>
                <Button 
                  onClick={() => navigate('/admin/teachers/add')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm giảng viên
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      {/* Header with avatar and basic info */}
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          {teacher.avatar ? (
                            <img src={teacher.avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                              <GraduationCap className="w-8 h-8 text-blue-600" />
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${
                            teacher.isActive ? 'bg-green-500' : 'bg-red-500'
                          } flex items-center justify-center`}>
                            {teacher.isActive ? <CheckCircle className="w-3 h-3 text-white" /> : <XCircle className="w-3 h-3 text-white" />}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{teacher.fullName}</h3>
                          {teacher.title && (
                            <Badge className="bg-purple-100 text-purple-700 mb-2 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {teacher.title}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{teacher.department}</span>
                        </div>
                        
                        {teacher.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{teacher.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/admin/teachers/edit/${teacher.id}`)} 
                          title="Chỉnh sửa"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Sửa</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(teacher)} 
                          title="Xem chi tiết"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Xem</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Xóa</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p)=>fetchTeachers(p)} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Teacher Details Modal */}
      {showDetailsModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết giảng viên</h2>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Đóng"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Teacher Details */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {selectedTeacher.avatar ? (
                      <img src={selectedTeacher.avatar} alt="avatar" className="w-24 h-24 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <GraduationCap className="w-12 h-12 text-blue-600" />
                      </div>
                    )}
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${
                      selectedTeacher.isActive ? 'bg-green-500' : 'bg-red-500'
                    } flex items-center justify-center`}>
                      {selectedTeacher.isActive ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTeacher.fullName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{selectedTeacher.email}</span>
                      </div>
                      {selectedTeacher.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{selectedTeacher.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTeacher.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedTeacher.hireDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Thông tin chuyên môn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTeacher.title && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Học hàm/Học vị:</span>
                        <p className="text-gray-900">{selectedTeacher.title}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                      <p className={`inline-flex items-center gap-1 ${selectedTeacher.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedTeacher.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {selectedTeacher.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedTeacher.bio && (
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Giới thiệu</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedTeacher.bio}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4 flex gap-3 justify-end">
                  <Button variant="outline" onClick={closeDetailsModal}>
                    Đóng
                  </Button>
                  <Button onClick={() => navigate(`/admin/teachers/edit/${selectedTeacher.id}`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserManagement;
