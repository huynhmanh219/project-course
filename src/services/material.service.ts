import { apiClient, handleApiResponse, handleApiError } from './api';
import type {
  ThuVienTaiLieu,
  CreateTaiLieuRequest,
  UpdateTaiLieuRequest,
  PaginationParams,
  PaginatedResponse
} from './types';

class MaterialService {
  // ==================== TÀI LIỆU ====================

  // Lấy danh sách tài liệu
  async getTaiLieus(params?: PaginationParams & {
    loaiTaiLieu?: number;
    chuongId?: number;
    monHocId?: number;
  }): Promise<PaginatedResponse<ThuVienTaiLieu>> {
    try {
      const response = await apiClient.get<any>('/tai-lieus', { params });
      return handleApiResponse<PaginatedResponse<ThuVienTaiLieu>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy tài liệu theo ID
  async getTaiLieuById(id: number): Promise<ThuVienTaiLieu> {
    try {
      const response = await apiClient.get<any>(`/tai-lieus/${id}`);
      return handleApiResponse<ThuVienTaiLieu>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy tài liệu theo chương
  async getTaiLieusByChuong(chuongId: number): Promise<ThuVienTaiLieu[]> {
    try {
      const response = await apiClient.get<any>(`/chuongs/${chuongId}/tai-lieus`);
      return handleApiResponse<ThuVienTaiLieu[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy tài liệu theo môn học
  async getTaiLieusByMonHoc(monHocId: number): Promise<ThuVienTaiLieu[]> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/${monHocId}/tai-lieus`);
      return handleApiResponse<ThuVienTaiLieu[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy tài liệu của user hiện tại
  async getMyTaiLieus(): Promise<ThuVienTaiLieu[]> {
    try {
      const response = await apiClient.get<any>('/tai-lieus/my-materials');
      return handleApiResponse<ThuVienTaiLieu[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Upload tài liệu mới
  async uploadTaiLieu(file: File, data: CreateTaiLieuRequest): Promise<ThuVienTaiLieu> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tenTaiLieu', data.tenTaiLieu);
      if (data.moTa) formData.append('moTa', data.moTa);
      formData.append('loaiTaiLieu', data.loaiTaiLieu.toString());
      if (data.chuongId) formData.append('chuongId', data.chuongId.toString());
      if (data.monHocId) formData.append('monHocId', data.monHocId.toString());

      const response = await apiClient.post<any>('/tai-lieus/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse<ThuVienTaiLieu>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Upload nhiều tài liệu cùng lúc
  async uploadMultipleTaiLieus(files: File[], data: {
    loaiTaiLieu: number;
    chuongId?: number;
    monHocId?: number;
    moTa?: string;
  }): Promise<ThuVienTaiLieu[]> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      formData.append('loaiTaiLieu', data.loaiTaiLieu.toString());
      if (data.chuongId) formData.append('chuongId', data.chuongId.toString());
      if (data.monHocId) formData.append('monHocId', data.monHocId.toString());
      if (data.moTa) formData.append('moTa', data.moTa);

      const response = await apiClient.post<any>('/tai-lieus/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse<ThuVienTaiLieu[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật thông tin tài liệu
  async updateTaiLieu(id: number, data: UpdateTaiLieuRequest): Promise<ThuVienTaiLieu> {
    try {
      const response = await apiClient.put<any>(`/tai-lieus/${id}`, data);
      return handleApiResponse<ThuVienTaiLieu>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa tài liệu
  async deleteTaiLieu(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/tai-lieus/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tải xuống tài liệu
  async downloadTaiLieu(id: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/tai-lieus/${id}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xem trước tài liệu
  async previewTaiLieu(id: number): Promise<string> {
    try {
      const response = await apiClient.get<any>(`/tai-lieus/${id}/preview`);
      return handleApiResponse<string>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== LOẠI TÀI LIỆU ====================

  // Lấy danh sách loại tài liệu
  async getLoaiTaiLieus(): Promise<{
    id: number;
    ten: string;
    moTa?: string;
    extension: string[];
    maxSize: number;
  }[]> {
    try {
      const response = await apiClient.get<any>('/loai-tai-lieus');
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== TÌM KIẾM & LỌC ====================

  // Tìm kiếm tài liệu
  async searchTaiLieus(params: {
    keyword: string;
    loaiTaiLieu?: number;
    chuongId?: number;
    monHocId?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ThuVienTaiLieu>> {
    try {
      const response = await apiClient.get<any>('/tai-lieus/search', { params });
      return handleApiResponse<PaginatedResponse<ThuVienTaiLieu>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lọc tài liệu theo tiêu chí
  async filterTaiLieus(filters: {
    loaiTaiLieu?: number[];
    size?: { min?: number; max?: number };
    dateRange?: { from: string; to: string };
    nguoiUpload?: number[];
  }): Promise<ThuVienTaiLieu[]> {
    try {
      const response = await apiClient.post<any>('/tai-lieus/filter', filters);
      return handleApiResponse<ThuVienTaiLieu[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== CHIA SẺ & QUYỀN TRUY CẬP ====================

  // Chia sẻ tài liệu
  async shareTaiLieu(id: number, options: {
    isPublic: boolean;
    allowedUsers?: number[];
    allowedRoles?: string[];
    expirationDate?: string;
  }): Promise<{ shareUrl: string; shareCode: string }> {
    try {
      const response = await apiClient.post<any>(`/tai-lieus/${id}/share`, options);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Truy cập tài liệu qua mã chia sẻ
  async accessByShareCode(shareCode: string): Promise<ThuVienTaiLieu> {
    try {
      const response = await apiClient.get<any>(`/tai-lieus/shared/${shareCode}`);
      return handleApiResponse<ThuVienTaiLieu>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Kiểm tra quyền truy cập tài liệu
  async checkTaiLieuAccess(id: number): Promise<{
    canRead: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  }> {
    try {
      const response = await apiClient.get<any>(`/tai-lieus/${id}/check-access`);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== THƯ MỤC & TỔ CHỨC ====================

  // Tạo thư mục
  async createFolder(data: {
    tenThuMuc: string;
    moTa?: string;
    parentId?: number;
    monHocId?: number;
  }): Promise<{ id: number; tenThuMuc: string; duongDan: string }> {
    try {
      const response = await apiClient.post<any>('/folders', data);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Di chuyển tài liệu vào thư mục
  async moveTaiLieuToFolder(taiLieuId: number, folderId: number): Promise<void> {
    try {
      const response = await apiClient.put<any>(`/tai-lieus/${taiLieuId}/move`, { folderId });
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== THỐNG KÊ ====================

  // Thống kê tài liệu
  async getMaterialStats(): Promise<{
    tongTaiLieu: number;
    tongDungLuong: number;
    theoLoai: { [key: string]: number };
    theoChuong: { [key: string]: number };
    uploadTrongThang: number;
  }> {
    try {
      const response = await apiClient.get<any>('/materials/stats');
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Thống kê tài liệu theo người dùng
  async getUserMaterialStats(userId: number): Promise<{
    soTaiLieuUpload: number;
    tongDungLuong: number;
    luotTaiXuong: number;
    taiLieuPhoBien: ThuVienTaiLieu[];
  }> {
    try {
      const response = await apiClient.get<any>(`/users/${userId}/material-stats`);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== BẢO TRÌ & QUẢN LÝ ====================

  // Dọn dẹp tài liệu không sử dụng
  async cleanupUnusedMaterials(): Promise<{
    deletedCount: number;
    freedSpace: number;
  }> {
    try {
      const response = await apiClient.post<any>('/materials/cleanup');
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Backup tài liệu
  async backupMaterials(options: {
    includeDeleted?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ backupUrl: string; size: number }> {
    try {
      const response = await apiClient.post<any>('/materials/backup', options);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const materialService = new MaterialService();
export default materialService; 