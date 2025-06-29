// Simple Auth Service - No complex types, use 'any' for simplicity
import { API_BASE_URL } from './api';

class AuthService {
  // Đăng nhập đơn giản - FIX: dùng 'password' thay vì 'matKhau'
  async login(credentials: any): Promise<any> {
    try {
      console.log('Login attempt:', credentials);
      
      // FIX: Convert matKhau to password nếu cần
      const loginData = {
        email: credentials.email,
        password: credentials.matKhau || credentials.password
      };
      
      console.log('Sending to backend:', loginData);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (response.ok && result.status === 'success') {
        // FIX: Backend format khác - data.tokens.accessToken
        const { data } = result;
        const accessToken = data.tokens.accessToken;
        const refreshToken = data.tokens.refreshToken;
        
        // Lưu token và thông tin user
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Login successful, tokens saved');
        
        // Return trong format mà frontend expect
        return {
          accessToken,
          refreshToken,
          user: data.user,
          tokens: data.tokens
        };
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Đăng xuất và redirect về login
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      // Luôn xóa local storage
      this.clearLocalStorage();
      console.log('Logged out, local storage cleared, redirecting to login...');
      
      // Redirect ngay về trang login
      window.location.href = '/login';
    }
  }

  // Đổi mật khẩu đơn giản
  async changePassword(data: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Change password failed');
      }

      return result;
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Kiểm tra token có hết hạn không
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Refresh token tự động
  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing access token...');
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        const newAccessToken = result.data.accessToken;
        localStorage.setItem('token', newAccessToken);
        console.log('Token refreshed successfully');
        return newAccessToken;
      } else {
        throw new Error(result.message || 'Token refresh failed');
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      this.logout(); // Auto logout if refresh fails
      window.location.href = '/login';
      return null;
    }
  }

  // Lấy token có kiểm tra expiration
  async getValidToken(): Promise<string | null> {
    const token = this.getToken();
    if (!token) return null;
    
    // Kiểm tra token có hết hạn không
    if (this.isTokenExpired()) {
      console.log('Token expired, attempting refresh...');
      return await this.refreshAccessToken();
    }
    
    return token;
  }

  // Kiểm tra đăng nhập với validation
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getValidToken();
    return !!token;
  }

  // Lấy user hiện tại
  getCurrentUser(): any {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // console.log('Current user:', user);
        return user;
      } catch (error) {
        console.error('Error parsing user:', error);
        return null;
      }
    }
    return null;
  }

  // Lấy role hiện tại
  getCurrentRole(): any {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Lấy token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Lấy refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Xóa localStorage
  private clearLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Kiểm tra quyền đơn giản
  hasPermission(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Simple role check - backend trả role string trực tiếp
    const userRole = user.role || 'student';
    console.log('Checking permission:', userRole, 'vs', requiredRole);
    
    return userRole.toLowerCase().includes(requiredRole.toLowerCase());
  }

  // Redirect dựa trên role
  redirectAfterLogin(): void {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const role = user.role || 'student';
    console.log('Redirecting user with role:', role);
    
    switch (role.toLowerCase()) {
      case 'admin':
      case 'administrator':
        window.location.href = '/admin/dashboard';
        break;
      case 'lecturer':
      case 'teacher':
        window.location.href = '/teacher/courses';
        break;
      case 'student':
      default:
        window.location.href = '/';
        break;
    }
  }
}

// Export singleton
export const authService = new AuthService();
export default authService; 