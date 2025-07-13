import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Save, ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { authService } from '../../services/auth.service';
import simpleUserService from '../../services/user.service.simple';

const TeacherEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    title: '',
    department: '',
    bio: '',
    hire_date: '',
    status: 'active',
    is_active: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const departmentOptions = [
    'Khoa Công nghệ Thông tin',
    'Khoa Kỹ thuật',
    'Khoa Kinh tế',
    'Khoa Ngoại ngữ',
   
  ];

  const titleOptions = [
    'Giảng viên',
    'Thạc sĩ',
    'Tiến sĩ',
    'Giáo sư'
  ];

  useEffect(() => {
    const loadTeacher = async () => {
      if (!id) {
        setError('ID giảng viên không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        
        const result = await simpleUserService.getTeacher(parseInt(id));
        
        if (result && result.teacher) {
          const teacher = result.teacher;
          const profile = teacher.profile;
          
          setForm({
            email: teacher.email || '',
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            title: profile?.title || '',
            department: profile?.department || '',
            bio: profile?.bio || '',
            hire_date: teacher.created_at ? new Date(teacher.created_at).toISOString().split('T')[0] : '',
            status: teacher.is_active ? 'active' : 'inactive',
            is_active: teacher.is_active !== false
          });
          
        } else {
          throw new Error('Không tìm thấy thông tin giảng viên');
        }
      } catch (error: any) {
        
        if (error.message === 'Token expired.' || error.message.includes('Unauthorized')) {
          setError('Phiên đăng nhập đã hết hạn. Bạn sẽ được chuyển về trang đăng nhập...');
          setTimeout(() => {
            authService.logout();
          }, 2000);
        } else {
        setError(error.message || 'Không thể tải thông tin giảng viên');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError('Email không hợp lệ');
      return false;
    }
    
    if (!form.first_name.trim()) {
      setError('Vui lòng nhập tên');
      return false;
    }
    
    if (!form.last_name.trim()) {
      setError('Vui lòng nhập họ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      setError('Chỉ admin mới có thể chỉnh sửa thông tin giảng viên');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      
      const updateData = {
        email: form.email.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        is_active: form.is_active,
        ...(form.phone && form.phone.trim() && { phone: form.phone.trim() }),
        ...(form.title && form.title.trim() && { title: form.title.trim() }),
        ...(form.department && form.department.trim() && { department: form.department.trim() }),
        ...(form.bio && form.bio.trim() && { bio: form.bio.trim() })
      };
      
      
      const result = await simpleUserService.updateTeacher(parseInt(id!), updateData);
      
      setSuccess('Cập nhật thông tin giảng viên thành công!');
      
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
      
    } catch (error: any) {
      
      if (error.message === 'Token expired.' || error.message.includes('Unauthorized')) {
        setError('Phiên đăng nhập đã hết hạn. Bạn sẽ được chuyển về trang đăng nhập...');
        setTimeout(() => {
          authService.logout();
        }, 2000);
      } else if (error.message === 'Validation failed') {
        setError('Lỗi validation: Vui lòng kiểm tra thông tin đã nhập. Chi tiết trong Console.');
      } else if (error.message.includes('Email already exists')) {
        setError('Email này đã được sử dụng bởi tài khoản khác. Vui lòng chọn email khác.');
      } else {
      setError(error.message || 'Có lỗi xảy ra khi cập nhật thông tin giảng viên');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin giảng viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <Edit className="w-10 h-10 text-white drop-shadow-lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Chỉnh sửa giảng viên</h1>
            <p className="text-orange-100 text-base">Cập nhật thông tin giảng viên trong hệ thống LMS</p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Form */}
        <form className="bg-white p-8 rounded-2xl shadow-xl space-y-6" onSubmit={handleSubmit}>
          {/* Account Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin tài khoản</h3>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                placeholder="lecturer@university.edu.vn"
              />
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                  placeholder="Nguyễn Văn"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                  placeholder="Nam"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                placeholder="0901234567"
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin chuyên môn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Học hàm/Học vị</label>
                <select
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                >
                  <option value="">Chọn học hàm/học vị</option>
                  {titleOptions.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Khoa/Bộ môn</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                >
                  <option value="">Chọn khoa/bộ môn</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Giới thiệu</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors resize-none"
                placeholder="Kinh nghiệm và chuyên môn của giảng viên..."
              />
            </div>
          </div>

          {/* Work Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin công việc</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Ngày tuyển dụng</label>
                <input
                  name="hire_date"
                  value={form.hire_date}
                  onChange={handleChange}
                  type="date"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="on_leave">Nghỉ phép</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-gray-700 font-medium">
                Tài khoản hoạt động
              </label>
              <span className="text-sm text-gray-500">
                (Bỏ tick để vô hiệu hóa tài khoản)
              </span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              onClick={() => navigate('/admin/users')}
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Cập nhật giảng viên
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEdit;
