import { apiClient, handleApiResponse, handleApiError } from './api';
import type { 
  LoginRequest, 
  LoginResponse, 
  ChangePasswordRequest,
  User 
} from './types';

class AuthService {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<any>('/auth/login', credentials);
      const data = handleApiResponse<LoginResponse>(response);
      
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', JSON.stringify(data.vaiTro));
      
      return data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      // Luôn xóa thông tin local dù API có lỗi
      this.clearLocalStorage();
    }
  }

  // Đổi mật khẩu
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      const response = await apiClient.put<any>('/auth/change-password', data);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await apiClient.post<any>('/auth/forgot-password', { email });
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Reset mật khẩu
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.post<any>('/auth/reset-password', {
        token,
        matKhauMoi: newPassword
      });
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<any>('/auth/refresh-token');
      const data = handleApiResponse<LoginResponse>(response);
      
      // Cập nhật token mới
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error: any) {
      // Nếu refresh token thất bại, chuyển về trang đăng nhập
      this.clearLocalStorage();
      window.location.href = '/login';
      throw handleApiError(error);
    }
  }

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Lấy role hiện tại từ localStorage
  getCurrentRole(): any | null {
    const roleString = localStorage.getItem('role');
    if (roleString) {
      try {
        return JSON.parse(roleString);
      } catch (error) {
        console.error('Error parsing role data:', error);
        return null;
      }
    }
    return null;
  }

  // Lấy token hiện tại
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Xóa dữ liệu localStorage
  private clearLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  // Kiểm tra quyền truy cập
  hasPermission(requiredRole: string): boolean {
    const currentRole = this.getCurrentRole();
    if (!currentRole) return false;

    const roleHierarchy: { [key: string]: number } = {
      'student': 1,
      'teacher': 2,
      'admin': 3
    };

    const currentRoleLevel = roleHierarchy[currentRole.tenVaiTro.toLowerCase()] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole.toLowerCase()] || 0;

    return currentRoleLevel >= requiredRoleLevel;
  }

  // Kiểm tra xem có phải lần đầu đăng nhập không
  isFirstLogin(): boolean {
    const user = this.getCurrentUser();
    return user?.lanDauDangNhap || false;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService; 