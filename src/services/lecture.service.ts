import { apiClient, handleApiResponse, handleApiError } from './api';
import type {
  BaiGiang,
  CreateBaiGiangRequest,
  UpdateBaiGiangRequest,
  Chuong,
  CreateChuongRequest,
  UpdateChuongRequest,
  PaginationParams,
  PaginatedResponse
} from './types';

class LectureService {
  // ==================== BÀI GIẢNG ====================

  // Lấy danh sách bài giảng
  async getBaiGiangs(params?: PaginationParams): Promise<PaginatedResponse<BaiGiang>> {
    try {
      const response = await apiClient.get<any>('/bai-giangs', { params });
      return handleApiResponse<PaginatedResponse<BaiGiang>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy bài giảng theo ID
  async getBaiGiangById(id: number): Promise<BaiGiang> {
    try {
      const response = await apiClient.get<any>(`/bai-giangs/${id}`);
      return handleApiResponse<BaiGiang>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy bài giảng theo môn học
  async getBaiGiangsByMonHoc(monHocId: number): Promise<BaiGiang[]> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/${monHocId}/bai-giangs`);
      return handleApiResponse<BaiGiang[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo bài giảng mới
  async createBaiGiang(data: CreateBaiGiangRequest): Promise<BaiGiang> {
    try {
      const response = await apiClient.post<any>('/bai-giangs', data);
      return handleApiResponse<BaiGiang>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật bài giảng
  async updateBaiGiang(id: number, data: UpdateBaiGiangRequest): Promise<BaiGiang> {
    try {
      const response = await apiClient.put<any>(`/bai-giangs/${id}`, data);
      return handleApiResponse<BaiGiang>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa bài giảng
  async deleteBaiGiang(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/bai-giangs/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật thứ tự bài giảng
  async updateBaiGiangOrder(baiGiangIds: number[]): Promise<void> {
    try {
      const response = await apiClient.put<any>('/bai-giangs/reorder', { baiGiangIds });
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Sao chép bài giảng
  async copyBaiGiang(id: number, monHocId: number): Promise<BaiGiang> {
    try {
      const response = await apiClient.post<any>(`/bai-giangs/${id}/copy`, { monHocId });
      return handleApiResponse<BaiGiang>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== CHƯƠNG ====================

  // Lấy danh sách chương
  async getChuongs(params?: PaginationParams): Promise<PaginatedResponse<Chuong>> {
    try {
      const response = await apiClient.get<any>('/chuongs', { params });
      return handleApiResponse<PaginatedResponse<Chuong>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy chương theo ID
  async getChuongById(id: number): Promise<Chuong> {
    try {
      const response = await apiClient.get<any>(`/chuongs/${id}`);
      return handleApiResponse<Chuong>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy chương theo bài giảng
  async getChuongsByBaiGiang(baiGiangId: number): Promise<Chuong[]> {
    try {
      const response = await apiClient.get<any>(`/bai-giangs/${baiGiangId}/chuongs`);
      return handleApiResponse<Chuong[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo chương mới
  async createChuong(data: CreateChuongRequest): Promise<Chuong> {
    try {
      const response = await apiClient.post<any>('/chuongs', data);
      return handleApiResponse<Chuong>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật chương
  async updateChuong(id: number, data: UpdateChuongRequest): Promise<Chuong> {
    try {
      const response = await apiClient.put<any>(`/chuongs/${id}`, data);
      return handleApiResponse<Chuong>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa chương
  async deleteChuong(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/chuongs/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật thứ tự chương
  async updateChuongOrder(chuongIds: number[]): Promise<void> {
    try {
      const response = await apiClient.put<any>('/chuongs/reorder', { chuongIds });
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Sao chép chương
  async copyChuong(id: number, baiGiangId: number): Promise<Chuong> {
    try {
      const response = await apiClient.post<any>(`/chuongs/${id}/copy`, { baiGiangId });
      return handleApiResponse<Chuong>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== TEMPLATE & IMPORT/EXPORT ====================

  // Lấy template bài giảng
  async getBaiGiangTemplates(): Promise<BaiGiang[]> {
    try {
      const response = await apiClient.get<any>('/bai-giangs/templates');
      return handleApiResponse<BaiGiang[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo template từ bài giảng
  async createTemplateFromBaiGiang(id: number): Promise<BaiGiang> {
    try {
      const response = await apiClient.post<any>(`/bai-giangs/${id}/create-template`);
      return handleApiResponse<BaiGiang>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Export bài giảng ra file
  async exportBaiGiang(id: number, format: 'pdf' | 'docx' | 'html'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/bai-giangs/${id}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Import bài giảng từ file
  async importBaiGiang(file: File, monHocId: number): Promise<BaiGiang> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('monHocId', monHocId.toString());
      
      const response = await apiClient.post<any>('/bai-giangs/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse<BaiGiang>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== THỐNG KÊ ====================

  // Thống kê bài giảng
  async getLectureStats(): Promise<{
    tongBaiGiang: number;
    tongChuong: number;
    baiGiangActive: number;
    trungBinhChuongMoiBaiGiang: number;
  }> {
    try {
      const response = await apiClient.get<any>('/lectures/stats');
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Thống kê theo môn học
  async getStatsMonHoc(monHocId: number): Promise<{
    soBaiGiang: number;
    soChuong: number;
    tiLeHoanThanh: number;
  }> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/${monHocId}/lecture-stats`);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== PHÂN QUYỀN & BẢO MẬT ====================

  // Thiết lập quyền truy cập bài giảng
  async setBaiGiangPermissions(id: number, permissions: {
    isPublic: boolean;
    allowedRoles: string[];
    allowedUsers: number[];
  }): Promise<void> {
    try {
      const response = await apiClient.put<any>(`/bai-giangs/${id}/permissions`, permissions);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Kiểm tra quyền truy cập bài giảng
  async checkBaiGiangAccess(id: number): Promise<{
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
  }> {
    try {
      const response = await apiClient.get<any>(`/bai-giangs/${id}/check-access`);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const lectureService = new LectureService();
export default lectureService; 