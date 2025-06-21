import { apiClient, handleApiResponse, handleApiError } from './api';
import type {
  GiangVien,
  CreateGiangVienRequest,
  UpdateGiangVienRequest,
  SinhVien,
  CreateSinhVienRequest,
  UpdateSinhVienRequest,
  VaiTro,
  PaginationParams,
  PaginatedResponse
} from './types';

class UserService {
  // ==================== GIẢNG VIÊN ====================
  
  // Lấy danh sách giảng viên
  async getGiangViens(params?: PaginationParams): Promise<PaginatedResponse<GiangVien>> {
    try {
      const response = await apiClient.get<any>('/giang-viens', { params });
      return handleApiResponse<PaginatedResponse<GiangVien>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy thông tin giảng viên theo ID
  async getGiangVienById(id: number): Promise<GiangVien> {
    try {
      const response = await apiClient.get<any>(`/giang-viens/${id}`);
      return handleApiResponse<GiangVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo giảng viên mới
  async createGiangVien(data: CreateGiangVienRequest): Promise<GiangVien> {
    try {
      const response = await apiClient.post<any>('/giang-viens', data);
      return handleApiResponse<GiangVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật thông tin giảng viên
  async updateGiangVien(id: number, data: UpdateGiangVienRequest): Promise<GiangVien> {
    try {
      const response = await apiClient.put<any>(`/giang-viens/${id}`, data);
      return handleApiResponse<GiangVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa giảng viên
  async deleteGiangVien(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/giang-viens/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Khóa/mở khóa tài khoản giảng viên
  async toggleGiangVienStatus(id: number): Promise<GiangVien> {
    try {
      const response = await apiClient.patch<any>(`/giang-viens/${id}/toggle-status`);
      return handleApiResponse<GiangVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Upload ảnh đại diện giảng viên
  async uploadGiangVienAvatar(id: number, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post<any>(`/giang-viens/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse<string>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== SINH VIÊN ====================

  // Lấy danh sách sinh viên
  async getSinhViens(params?: PaginationParams): Promise<PaginatedResponse<SinhVien>> {
    try {
      const response = await apiClient.get<any>('/sinh-viens', { params });
      return handleApiResponse<PaginatedResponse<SinhVien>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy thông tin sinh viên theo ID
  async getSinhVienById(id: number): Promise<SinhVien> {
    try {
      const response = await apiClient.get<any>(`/sinh-viens/${id}`);
      return handleApiResponse<SinhVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy sinh viên theo MSSV
  async getSinhVienByMSSV(mssv: string): Promise<SinhVien> {
    try {
      const response = await apiClient.get<any>(`/sinh-viens/mssv/${mssv}`);
      return handleApiResponse<SinhVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo sinh viên mới
  async createSinhVien(data: CreateSinhVienRequest): Promise<SinhVien> {
    try {
      const response = await apiClient.post<any>('/sinh-viens', data);
      return handleApiResponse<SinhVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật thông tin sinh viên
  async updateSinhVien(id: number, data: UpdateSinhVienRequest): Promise<SinhVien> {
    try {
      const response = await apiClient.put<any>(`/sinh-viens/${id}`, data);
      return handleApiResponse<SinhVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa sinh viên
  async deleteSinhVien(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/sinh-viens/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Khóa/mở khóa tài khoản sinh viên
  async toggleSinhVienStatus(id: number): Promise<SinhVien> {
    try {
      const response = await apiClient.patch<any>(`/sinh-viens/${id}/toggle-status`);
      return handleApiResponse<SinhVien>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Upload ảnh đại diện sinh viên
  async uploadSinhVienAvatar(id: number, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post<any>(`/sinh-viens/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse<string>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Import sinh viên từ file Excel
  async importSinhViensFromExcel(file: File): Promise<{ success: number; failed: number; errors: any[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<any>('/sinh-viens/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== VAI TRÒ ====================

  // Lấy danh sách vai trò
  async getVaiTros(): Promise<VaiTro[]> {
    try {
      const response = await apiClient.get<any>('/vai-tros');
      return handleApiResponse<VaiTro[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy thông tin vai trò theo ID
  async getVaiTroById(id: number): Promise<VaiTro> {
    try {
      const response = await apiClient.get<any>(`/vai-tros/${id}`);
      return handleApiResponse<VaiTro>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo vai trò mới
  async createVaiTro(data: { tenVaiTro: string; moTa?: string }): Promise<VaiTro> {
    try {
      const response = await apiClient.post<any>('/vai-tros', data);
      return handleApiResponse<VaiTro>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật vai trò
  async updateVaiTro(id: number, data: { tenVaiTro?: string; moTa?: string; trangThai?: boolean }): Promise<VaiTro> {
    try {
      const response = await apiClient.put<any>(`/vai-tros/${id}`, data);
      return handleApiResponse<VaiTro>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa vai trò
  async deleteVaiTro(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/vai-tros/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== THỐNG KÊ ====================

  // Thống kê người dùng
  async getUserStats(): Promise<{
    tongGiangVien: number;
    tongSinhVien: number;
    giangVienActive: number;
    sinhVienActive: number;
  }> {
    try {
      const response = await apiClient.get<any>('/users/stats');
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService; 