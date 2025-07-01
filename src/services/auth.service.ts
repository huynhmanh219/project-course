// Simple Auth Service - No complex types, use 'any' for simplicity
import { API_BASE_URL } from './api';

class AuthService {
  // Đăng nhập đơn giản - FIX: dùng 'password' thay vì 'matKhau'
  async login(credentials: any): Promise<any> {
    try {
      console.log('🔐 Login attempt with credentials:', credentials);
      
      // FIX: Convert matKhau to password nếu cần
      const loginData = {
        email: credentials.email,
        password: credentials.matKhau || credentials.password
      };
      
      console.log('📤 Sending login data to backend:', loginData);
      console.log('🌐 API URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      console.log('📋 Response status:', response.status, response.statusText);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📨 Login response:', result);
      console.log('📨 Full response object:', JSON.stringify(result, null, 2));
      
      // Debug validation errors
      if (result.errors && Array.isArray(result.errors)) {
        console.log('❌ Validation errors:', result.errors);
        result.errors.forEach((error: string, index: number) => {
          console.log(`  Validation Error ${index + 1}:`, error);
        });
      }

      // Check if response indicates success
      console.log('✅ Response OK?', response.ok);
      console.log('✅ Status === success?', result.status === 'success');

      if (response.ok && result.status === 'success') {
        // FIX: Backend format khác - data.tokens.accessToken
        const { data } = result;
        console.log('📦 Data from response:', data);
        
        const accessToken = data.tokens.accessToken;
        const refreshToken = data.tokens.refreshToken;
        
        console.log('🎫 Access token:', accessToken ? 'EXISTS' : 'MISSING');
        console.log('🔄 Refresh token:', refreshToken ? 'EXISTS' : 'MISSING');
        console.log('👤 User data:', data.user);
        
        // Lưu token và thông tin user
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Login successful, tokens and user data saved to localStorage');
        
        // Return trong format mà frontend expect
        return {
          accessToken,
          refreshToken,
          user: data.user,
          tokens: data.tokens
        };
      } else {
        console.error('❌ Login failed - response details:');
        console.error('  Status code:', response.status);
        console.error('  Status text:', response.statusText);
        console.error('  Result status:', result.status);
        console.error('  Result message:', result.message);
        console.error('  Full result:', result);
        
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('💥 Login error:', error);
      console.error('💥 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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
    console.log('🔍 [getCurrentUser] Raw user string from localStorage:', userString);
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log('👤 [getCurrentUser] Parsed user data:', user);
        console.log('📧 [getCurrentUser] User email:', user.email);
        console.log('🏷️ [getCurrentUser] User role:', user.role);
        console.log('🆔 [getCurrentUser] User ID:', user.id);
        
        // Check if token is still valid
        const token = this.getToken();
        console.log('🎫 [getCurrentUser] Current token exists:', !!token);
        console.log('⏰ [getCurrentUser] Token expired:', this.isTokenExpired());
        
        return user;
      } catch (error) {
        console.error('❌ [getCurrentUser] Error parsing user:', error);
        return null;
      }
    }
    console.log('❌ [getCurrentUser] No user found in localStorage');
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

  // Refresh user data từ server để kiểm tra
  async refreshUserData(): Promise<any> {
    try {
      console.log('🔄 [refreshUserData] Fetching fresh user data from server...');
      
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
      console.log('🌐 [refreshUserData] Server response:', result);

      if (response.ok && result.status === 'success') {
        const freshUserData = result.data.user;
        console.log('✅ [refreshUserData] Fresh user data from server:', freshUserData);
        
        // Compare with localStorage data
        const localUser = this.getCurrentUser();
        console.log('🔄 [refreshUserData] Comparison:');
        console.log('  Server email:', freshUserData.email);
        console.log('  Local email:', localUser?.email);
        console.log('  Server ID:', freshUserData.id);
        console.log('  Local ID:', localUser?.id);
        console.log('  Server role:', freshUserData.role);
        console.log('  Local role:', localUser?.role);
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(freshUserData));
        console.log('✅ [refreshUserData] Updated localStorage with fresh data');
        
        return freshUserData;
      } else {
        throw new Error(result.message || 'Failed to refresh user data');
      }
    } catch (error: any) {
      console.error('❌ [refreshUserData] Error:', error);
      throw error;
    }
  }
}

// Export singleton
export const authService = new AuthService();
export default authService; 