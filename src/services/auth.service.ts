import { API_BASE_URL } from './api';

class AuthService {
  async login(credentials: any): Promise<any> {
    try {
      
      const loginData = {
        email: credentials.email,
        password: credentials.matKhau || credentials.password
      };
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });


      const result = await response.json();

      
      if (result.errors && Array.isArray(result.errors)) {
        // result.errors.forEach((error: string, index: number) => {
        // });
      }

  

      if (response.ok && result.status === 'success') {
        const { data } = result;
        const accessToken = data.tokens.accessToken;
        const refreshToken = data.tokens.refreshToken;

        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const userData = { ...data.user };
        if (userData.role === 'lecturer' && userData.profile?.id) {
          userData.lecturer_id = userData.profile.id;
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        
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
    } finally {
      // Luôn xóa local storage
      this.clearLocalStorage();
      
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
        return newAccessToken;
      } else {
        throw new Error(result.message || 'Token refresh failed');
      }
    } catch (error: any) {
      this.logout(); 
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
        const token = this.getToken();
        void token;
        return user;
      } catch (error) {
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
    
    const userRole = user.role || 'student';
    
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

  // Refresh user data từ server để kiểm tra
  async refreshUserData(): Promise<any> {
    try {
      
      const token = await this.getValidToken();
      if (!token) {
        throw new Error('No valid token available');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        const freshUserData = result.data.user;
        
        const localUser = this.getCurrentUser();
        void localUser;
        
        localStorage.setItem('user', JSON.stringify(freshUserData));
        
        return freshUserData;
      } else {
        throw new Error(result.message || 'Failed to refresh user data');
      }
    } catch (error: any) {
      throw error;
    }
  }
}


export const authService = new AuthService();
export default authService; 