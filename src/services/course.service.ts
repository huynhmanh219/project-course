import { apiClient, handleApiResponse, handleApiError } from './api';
import type {
  MonHoc,
  CreateMonHocRequest,
  UpdateMonHocRequest,
  LopHoc,
  CreateLopHocRequest,
  UpdateLopHocRequest,
  SinhVienLopHoc,
  EnrollStudentRequest,
  TienDoHocTap,
  PaginationParams,
  PaginatedResponse
} from './types';

class CourseService {
  // ==================== MÔN HỌC ====================

  // Lấy danh sách môn học
  async getMonHocs(params?: PaginationParams): Promise<PaginatedResponse<MonHoc>> {
    try {
      const response = await apiClient.get<any>('/mon-hocs', { params });
      return handleApiResponse<PaginatedResponse<MonHoc>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy môn học theo ID
  async getMonHocById(id: number): Promise<MonHoc> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/${id}`);
      return handleApiResponse<MonHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy môn học theo mã môn học
  async getMonHocByMa(maMonHoc: string): Promise<MonHoc> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/ma/${maMonHoc}`);
      return handleApiResponse<MonHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy môn học của giảng viên
  async getMonHocsByGiangVien(giangVienId: number): Promise<MonHoc[]> {
    try {
      const response = await apiClient.get<any>(`/giang-viens/${giangVienId}/mon-hocs`);
      return handleApiResponse<MonHoc[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo môn học mới
  async createMonHoc(data: CreateMonHocRequest): Promise<MonHoc> {
    try {
      const response = await apiClient.post<any>('/mon-hocs', data);
      return handleApiResponse<MonHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật môn học
  async updateMonHoc(id: number, data: UpdateMonHocRequest): Promise<MonHoc> {
    try {
      const response = await apiClient.put<any>(`/mon-hocs/${id}`, data);
      return handleApiResponse<MonHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa môn học
  async deleteMonHoc(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/mon-hocs/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== LỚP HỌC ====================

  // Lấy danh sách lớp học
  async getLopHocs(params?: PaginationParams): Promise<PaginatedResponse<LopHoc>> {
    try {
      const response = await apiClient.get<any>('/lop-hocs', { params });
      return handleApiResponse<PaginatedResponse<LopHoc>>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy lớp học theo ID
  async getLopHocById(id: number): Promise<LopHoc> {
    try {
      const response = await apiClient.get<any>(`/lop-hocs/${id}`);
      return handleApiResponse<LopHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy lớp học của giảng viên
  async getLopHocsByGiangVien(giangVienId: number): Promise<LopHoc[]> {
    try {
      const response = await apiClient.get<any>(`/giang-viens/${giangVienId}/lop-hocs`);
      return handleApiResponse<LopHoc[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy lớp học của sinh viên
  async getLopHocsBySinhVien(sinhVienId: number): Promise<LopHoc[]> {
    try {
      const response = await apiClient.get<any>(`/sinh-viens/${sinhVienId}/lop-hocs`);
      return handleApiResponse<LopHoc[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy lớp học theo môn học
  async getLopHocsByMonHoc(monHocId: number): Promise<LopHoc[]> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/${monHocId}/lop-hocs`);
      return handleApiResponse<LopHoc[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Tạo lớp học mới
  async createLopHoc(data: CreateLopHocRequest): Promise<LopHoc> {
    try {
      const response = await apiClient.post<any>('/lop-hocs', data);
      return handleApiResponse<LopHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật lớp học
  async updateLopHoc(id: number, data: UpdateLopHocRequest): Promise<LopHoc> {
    try {
      const response = await apiClient.put<any>(`/lop-hocs/${id}`, data);
      return handleApiResponse<LopHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa lớp học
  async deleteLopHoc(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/lop-hocs/${id}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== SINH VIÊN - LỚP HỌC ====================

  // Lấy danh sách sinh viên trong lớp
  async getSinhViensInLopHoc(lopHocId: number): Promise<SinhVienLopHoc[]> {
    try {
      const response = await apiClient.get<any>(`/lop-hocs/${lopHocId}/sinh-viens`);
      return handleApiResponse<SinhVienLopHoc[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Thêm sinh viên vào lớp học
  async enrollStudent(data: EnrollStudentRequest): Promise<SinhVienLopHoc> {
    try {
      const response = await apiClient.post<any>('/enrollments', data);
      return handleApiResponse<SinhVienLopHoc>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Thêm nhiều sinh viên vào lớp học
  async enrollMultipleStudents(lopHocId: number, sinhVienIds: number[]): Promise<SinhVienLopHoc[]> {
    try {
      const response = await apiClient.post<any>('/enrollments/bulk', {
        lopHocId,
        sinhVienIds
      });
      return handleApiResponse<SinhVienLopHoc[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Xóa sinh viên khỏi lớp học
  async removeStudentFromClass(lopHocId: number, sinhVienId: number): Promise<void> {
    try {
      const response = await apiClient.delete<any>(`/lop-hocs/${lopHocId}/sinh-viens/${sinhVienId}`);
      handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Import sinh viên vào lớp từ file Excel
  async importStudentsToClass(lopHocId: number, file: File): Promise<{ success: number; failed: number; errors: any[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<any>(`/lop-hocs/${lopHocId}/import-students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== TIẾN ĐỘ HỌC TẬP ====================

  // Lấy tiến độ học tập của sinh viên
  async getProgressBySinhVien(sinhVienId: number): Promise<TienDoHocTap[]> {
    try {
      const response = await apiClient.get<any>(`/sinh-viens/${sinhVienId}/progress`);
      return handleApiResponse<TienDoHocTap[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Lấy tiến độ học tập theo môn học
  async getProgressByMonHoc(monHocId: number): Promise<TienDoHocTap[]> {
    try {
      const response = await apiClient.get<any>(`/mon-hocs/${monHocId}/progress`);
      return handleApiResponse<TienDoHocTap[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Cập nhật tiến độ học tập
  async updateProgress(sinhVienId: number, monHocId: number, hoanThanh: boolean): Promise<TienDoHocTap> {
    try {
      const response = await apiClient.put<any>('/progress', {
        sinhVienId,
        monHocId,
        hoanThanh
      });
      return handleApiResponse<TienDoHocTap>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // ==================== THỐNG KÊ ====================

  // Thống kê môn học và lớp học
  async getCourseStats(): Promise<{
    tongMonHoc: number;
    tongLopHoc: number;
    lopHocActive: number;
    trungBinhSinhVienMoiLop: number;
  }> {
    try {
      const response = await apiClient.get<any>('/courses/stats');
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Thống kê theo giảng viên
  async getStatsGiangVien(giangVienId: number): Promise<{
    soMonHoc: number;
    soLopHoc: number;
    tongSinhVien: number;
    tienDoTrungBinh: number;
  }> {
    try {
      const response = await apiClient.get<any>(`/giang-viens/${giangVienId}/stats`);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const courseService = new CourseService();
export default courseService; 