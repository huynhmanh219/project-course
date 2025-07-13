import React, { useState } from "react";
import { UserPlus, User, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth.service";
import SimpleUserService from "../../../services/user.service.simple";

const TeacherStudentAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  void showPassword;
  void setShowPassword;
  const [form, setForm] = useState({
    student_id: "",           // MSSV
    first_name: "",           // Họ đệm
    last_name: "",            // Tên
    personal_email: "",       // Email cá nhân
    phone: "",
    date_of_birth: "",
    address: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.student_id || !form.first_name || !form.last_name) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      setLoading(false);
      return;
    }

    if (form.personal_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personal_email)) {
      setError('Email cá nhân không hợp lệ');
      setLoading(false);
      return;
    }

    if (form.phone && !form.phone.match(/^\d+$/)) {
      setError('Số điện thoại phải là số');
      setLoading(false);
      return;
    }

    if (!form.date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setError('Ngày sinh phải đúng định dạng YYYY-MM-DD');
      setLoading(false);
      return;
    }

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !['lecturer', 'admin'].includes(currentUser.role)) {
        setError('Bạn không có quyền tạo tài khoản sinh viên');
        setLoading(false);
        return;
      }

   
      const sanitizedData = {
        student_id: String(form.student_id || '').trim(),
        first_name: String(form.first_name || '').trim(),
        last_name: String(form.last_name || '').trim(),
        personal_email: form.personal_email ? String(form.personal_email).trim() : undefined,
        phone: String(form.phone || '').trim() || undefined,
        date_of_birth: form.date_of_birth ? String(form.date_of_birth).trim() : undefined,
        address: String(form.address || '').trim() || undefined
      };
      
      
      const response = await SimpleUserService.createStudent(sanitizedData);
      
      const autoEmail = `${form.student_id}@lms.com`;
      const autoPassword = form.student_id;
      
      alert(`Tạo tài khoản sinh viên thành công!\n\nMSSV: ${form.student_id}\nHọ tên: ${form.first_name} ${form.last_name}\nEmail: ${autoEmail}\nMật khẩu: ${autoPassword}\n\nSinh viên cần đổi mật khẩu lần đầu đăng nhập.`);
      navigate('/teacher/students');
      
    } catch (error: any) {
      console.error('Create student error:', error);
      
      let errorMessage = 'Lỗi khi tạo tài khoản sinh viên: ';
      if (error.message.includes('Student ID already exists')) {
        errorMessage = 'MSSV đã tồn tại trong hệ thống!';
      } else if (error.message.includes('Validation failed')) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else {
        errorMessage += (error.message || 'Vui lòng thử lại');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Thêm sinh viên</h1>
            <p className="text-blue-100 text-base">Tạo tài khoản sinh viên mới cho hệ thống LMS.</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                MSSV <span className="text-red-500">*</span>
              </label>
              <input
                name="student_id"
                value={form.student_id}
                onChange={handleChange}
                required
                disabled={loading}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="VD: SV001, 2023001234"
              />
            </div>
          </div>

          {/* Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Họ và tên đệm <span className="text-red-500">*</span>
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                disabled={loading}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="VD: Nguyễn Văn"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                disabled={loading}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="VD: An"
              />
            </div>
          </div>

          {/* Personal Email Section */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Email cá nhân (để nhận thông báo)
            </label>
            <input
              name="personal_email"
              value={form.personal_email}
              onChange={handleChange}
              type="email"
              disabled={loading}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
              placeholder="student@example.com"
            />
          </div>

          {/* Phone Section */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={loading}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
              placeholder="VD: 0123456789"
            />
          </div>

          {/* Date of Birth Section */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              required
              type="date"
              disabled={loading}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
            />
          </div>

          {/* Address Section */}
          <div className="mt-6">
            <label className="block text-gray-700 mb-2 font-semibold">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100 resize-none"
              placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/teacher/students')}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl font-bold shadow hover:from-gray-500 hover:to-gray-700 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition duration-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Tạo tài khoản
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherStudentAdd; 