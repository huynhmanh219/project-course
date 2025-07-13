import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';
import simpleUserService from '../../services/user.service.simple';

const TeacherAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    title: '',
    department: '',
    bio: '',
    hire_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const departmentOptions = [
    'Khoa Công nghệ Thông tin',
    'Khoa Kỹ thuật',
    'Khoa Kinh tế',
    'Khoa Ngoại ngữ'
   ];

  const titleOptions = [
    'Giảng viên',
    'Thạc sĩ',
    'Tiến sĩ',
    'Giáo sư'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
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
    
    if (!form.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    
    if (form.password.length < 1) {
      setError('Mật khẩu phải có ít nhất 1 ký tự');
      return false;
    }
    
    if (!form.first_name.trim()) {
      setError('Vui lòng nhập tên');
      return false;
    }
    
    if (form.first_name.length < 2 || form.first_name.length > 50) {
      setError('Tên phải có từ 2-50 ký tự');
      return false;
    }
    
    if (!form.last_name.trim()) {
      setError('Vui lòng nhập họ');
      return false;
    }
    
    if (form.last_name.length < 2 || form.last_name.length > 50) {
      setError('Họ phải có từ 2-50 ký tự');
      return false;
    }
    
    // Phone validation - backend pattern: /^[0-9+\-\s()]+$/
    if (form.phone && form.phone.trim()) {
      const phonePattern = /^[0-9+\-\s()]+$/;
      if (!phonePattern.test(form.phone)) {
        setError('Số điện thoại chỉ được chứa số, dấu +, -, khoảng trắng và dấu ngoặc ()');
        return false;
      }
    }
    
    // Optional field length validation
    if (form.title && form.title.length > 100) {
      setError('Học hàm/học vị không được quá 100 ký tự');
      return false;
    }
    
    if (form.department && form.department.length > 100) {
      setError('Khoa/bộ môn không được quá 100 ký tự');
      return false;
    }
    
    if (form.bio && form.bio.length > 1000) {
      setError('Giới thiệu không được quá 1000 ký tự');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      setError('Chỉ admin mới có thể tạo tài khoản giảng viên');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      
      const teacherData = {
        email: form.email.trim(),
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        ...(form.phone && form.phone.trim() && { phone: form.phone.trim() }),
        ...(form.title && form.title.trim() && { title: form.title.trim() }),
        ...(form.department && form.department.trim() && { department: form.department.trim() }),
        ...(form.bio && form.bio.trim() && { bio: form.bio.trim() })
      };
      
      const result = await simpleUserService.createTeacher(teacherData);
      
      setSuccess('Tạo tài khoản giảng viên thành công!');
      
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
        setError('Lỗi validation: Vui lòng kiểm tra thông tin đã nhập. Chi tiết trong Console. Có thể là: Email không hợp lệ, Tên/Họ quá ngắn (< 2 ký tự), hoặc số điện thoại không đúng định dạng.');
      } else {
        setError(error.message || 'Có lỗi xảy ra khi tạo tài khoản giảng viên');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Thêm giảng viên mới</h1>
            <p className="text-blue-100 text-base">Tạo tài khoản giảng viên cho hệ thống LMS</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  type="password"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors"
                  placeholder="Mật khẩu đăng nhập (ít nhất 1 ký tự)"
                />
              </div>
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
                  placeholder="Nguyễn Văn (2-50 ký tự)"
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
                  placeholder="Nam (2-50 ký tự)"
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
                placeholder="0901234567 (chỉ số, +, -, space, ngoặc đơn)"
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
              <label className="block text-gray-700 mb-2 font-semibold">
                Giới thiệu <span className="text-gray-500 text-sm">(tối đa 1000 ký tự)</span>
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition-colors resize-none"
                placeholder="Kinh nghiệm và chuyên môn của giảng viên..."
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {form.bio.length}/1000 ký tự
              </div>
            </div>
          </div>

          {/* Work Info - Display only, not sent to API */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin công việc</h3>
            <p className="text-sm text-gray-500 italic">
              ℹ Ngày tuyển dụng và trạng thái sẽ được thiết lập mặc định sau khi tạo tài khoản
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Ngày tuyển dụng</label>
                <input
                  name="hire_date"
                  value={form.hire_date}
                  onChange={handleChange}
                  type="date"
                  disabled
                  className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                  title="Sẽ được thiết lập tự động"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled
                  className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                  title="Sẽ được thiết lập mặc định là Hoạt động"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="on_leave">Nghỉ phép</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              onClick={() => navigate('/admin/users')}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Tạo giảng viên
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAdd;
