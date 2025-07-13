import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { authService } from "../services/auth.service";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    if (token && user) {
      redirectToRoleDashboard(user.role);
    }
  }, []);

  const redirectToRoleDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'lecturer':
        navigate('/teacher/courses'); 
        break;
      case 'student':
        navigate('/student/classes');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError("Email không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login:', { email });
      
      const loginData = {
        email: email,
        password: password 
      };

      const response = await authService.login(loginData);
      console.log('Login successful:', response);

      if (response && response.user) {
        redirectToRoleDashboard(response.user.role);
      } else {
        setError("Đăng nhập thành công nhưng không nhận được thông tin người dùng");
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      
      if (err.message) {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-2">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">LMS Portal</h1>
          <p className="text-gray-600">Hệ thống quản lý học tập</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {error ? "Sai tên đăng nhập hoặc mật khẩu" : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">🧪 Tài khoản test:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Admin:</strong> admin@lms.com / admin123</div>
            <div><strong>Giáo viên:</strong> lecturer@lms.com / lecturer123</div>
            <div><strong>Sinh viên:</strong> student@lms.com / student123</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <a href="/change-password" className="text-blue-600 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}