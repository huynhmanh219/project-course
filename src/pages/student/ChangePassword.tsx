import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, User, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const currentUser = authService.getCurrentUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setError(''); // Clear error when user types
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const validateForm = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường');
      return false;
    }

    if (form.newPassword.length < 1) {
      setError('Mật khẩu mới phải có ít nhất 1 ký tự');
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return false;
    }

    if (form.currentPassword === form.newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });

      setSuccess(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        authService.logout();
        navigate('/login', { 
          state: { 
            message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' 
          }
        });
      }, 3000);

    } catch (error: any) {
      console.error('Change password error:', error);
      let errorMessage = 'Có lỗi xảy ra khi đổi mật khẩu';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('Current password is incorrect')) {
        errorMessage = 'Mật khẩu hiện tại không đúng';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '', width: '0%' };
    if (password.length < 3) return { strength: 1, text: 'Yếu', color: 'bg-red-500', width: '25%' };
    if (password.length < 6) return { strength: 2, text: 'Trung bình', color: 'bg-yellow-500', width: '50%' };
    if (password.length < 10) return { strength: 3, text: 'Khá', color: 'bg-blue-500', width: '75%' };
    if (password.length >= 10 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: 'Rất mạnh', color: 'bg-green-500', width: '100%' };
    }
    return { strength: 3, text: 'Khá', color: 'bg-blue-500', width: '75%' };
  };

  const passwordStrength = getPasswordStrength(form.newPassword);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-green-100">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Thành công!
          </h1>
          <p className="text-gray-600 mb-2 text-lg">
            Mật khẩu đã được thay đổi thành công
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Bạn sẽ được chuyển đến trang đăng nhập để đăng nhập lại với mật khẩu mới
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full animate-pulse transition-all duration-1000"></div>
          </div>
          <p className="text-gray-400 text-xs">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Đổi mật khẩu</h1>
          <p className="text-blue-100 text-base leading-relaxed">
            {currentUser?.first_login ? 
              '🔒 Lần đầu đăng nhập, vui lòng đổi mật khẩu để bảo mật tài khoản' :
              '🔐 Cập nhật mật khẩu của bạn để tăng cường bảo mật'
            }
          </p>
          {currentUser && (
            <div className="mt-6 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <p className="text-xs text-blue-100">Đang đăng nhập với:</p>
              </div>
              <p className="font-bold text-lg">{currentUser.email}</p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mr-3" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 pr-12 text-lg transition-all duration-200"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 pr-12 text-lg transition-all duration-200"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">Độ mạnh mật khẩu:</span>
                  <span className={`text-xs font-bold ${
                    passwordStrength.strength === 1 ? 'text-red-500' :
                    passwordStrength.strength === 2 ? 'text-yellow-500' :
                    passwordStrength.strength === 3 ? 'text-blue-500' :
                    'text-green-500'
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 pr-12 text-lg transition-all duration-200"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password Match Indicator */}
            {form.confirmPassword && (
              <div className="mt-2">
                {form.newPassword === form.confirmPassword ? (
                  <p className="text-xs text-green-600 flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    ✅ Mật khẩu trùng khớp
                  </p>
                ) : (
                  <p className="text-xs text-red-600 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    ❌ Mật khẩu không trùng khớp
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
              className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  🔄 Đổi mật khẩu
                </>
              )}
            </button>
          </div>

          {/* Security Tips */}
          <div className="pt-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-bold text-blue-800 mb-2">💡 Gợi ý bảo mật:</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Sử dụng mật khẩu dài và phức tạp</li>
                <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword; 