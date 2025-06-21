// Base types
export interface BaseEntity {
  id: number;
  trangThai: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  matKhau: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  vaiTro: VaiTro;
}

export interface ChangePasswordRequest {
  matKhauCu: string;
  matKhauMoi: string;
  xacNhanMatKhau: string;
}

// User types
export interface User {
  id: number;
  email: string;
  vaiTroId: number;
  lanDauDangNhap: boolean;
  ngayTao: string;
  trangThai: boolean;
}

export interface VaiTro {
  id: number;
  tenVaiTro: string;
  moTa?: string;
  trangThai: boolean;
}

// Teacher types
export interface GiangVien extends BaseEntity {
  maGiangVien: string;
  taiKhoanId: number;
  hoTen: string;
  hinhAnh?: string;
  khoaId: number;
  khoa?: Khoa;
}

export interface CreateGiangVienRequest {
  maGiangVien: string;
  hoTen: string;
  email: string;
  khoaId: number;
  hinhAnh?: string;
}

export interface UpdateGiangVienRequest {
  hoTen?: string;
  khoaId?: number;
  hinhAnh?: string;
  trangThai?: boolean;
}

// Student types
export interface SinhVien extends BaseEntity {
  taiKhoanId: number;
  hoTen: string;
  mssv: string;
  hinhAnh?: string;
  ngayThem: string;
}

export interface CreateSinhVienRequest {
  hoTen: string;
  mssv: string;
  email: string;
  hinhAnh?: string;
}

export interface UpdateSinhVienRequest {
  hoTen?: string;
  hinhAnh?: string;
  trangThai?: boolean;
}

// Department types
export interface Khoa extends BaseEntity {
  maKhoa: string;
  tenKhoa: string;
  moTa?: string;
}

export interface CreateKhoaRequest {
  maKhoa: string;
  tenKhoa: string;
  moTa?: string;
}

export interface UpdateKhoaRequest {
  tenKhoa?: string;
  moTa?: string;
  trangThai?: boolean;
}

// Course types
export interface MonHoc extends BaseEntity {
  maMonHoc: string;
  tenMonHoc: string;
  moTa?: string;
  giangVienId: number;
  giangVien?: GiangVien;
}

export interface CreateMonHocRequest {
  maMonHoc: string;
  tenMonHoc: string;
  moTa?: string;
  giangVienId: number;
}

export interface UpdateMonHocRequest {
  tenMonHoc?: string;
  moTa?: string;
  giangVienId?: number;
  trangThai?: boolean;
}

// Class types
export interface LopHoc extends BaseEntity {
  maLopHoc: string;
  tenLopHoc: string;
  monHocId: number;
  giangVienId: number;
  moTa?: string;
  monHoc?: MonHoc;
  giangVien?: GiangVien;
  soSinhVien?: number;
}

export interface CreateLopHocRequest {
  maLopHoc: string;
  tenLopHoc: string;
  monHocId: number;
  giangVienId: number;
  moTa?: string;
}

export interface UpdateLopHocRequest {
  tenLopHoc?: string;
  moTa?: string;
  trangThai?: boolean;
}

// Lecture types
export interface BaiGiang extends BaseEntity {
  tenBaiGiang: string;
  moTa?: string;
  thuTu: number;
  noiDung?: string;
  monHocId: number;
  monHoc?: MonHoc;
}

export interface CreateBaiGiangRequest {
  tenBaiGiang: string;
  moTa?: string;
  thuTu: number;
  noiDung?: string;
  monHocId: number;
}

export interface UpdateBaiGiangRequest {
  tenBaiGiang?: string;
  moTa?: string;
  thuTu?: number;
  noiDung?: string;
  trangThai?: boolean;
}

// Chapter types
export interface Chuong extends BaseEntity {
  tenChuong: string;
  moTa?: string;
  baiGiangId: number;
  thuTu: number;
  baiGiang?: BaiGiang;
}

export interface CreateChuongRequest {
  tenChuong: string;
  moTa?: string;
  baiGiangId: number;
  thuTu: number;
}

export interface UpdateChuongRequest {
  tenChuong?: string;
  moTa?: string;
  thuTu?: number;
  trangThai?: boolean;
}

// Material types
export interface ThuVienTaiLieu extends BaseEntity {
  tenTaiLieu: string;
  moTa?: string;
  loaiTaiLieu: number;
  duongDanFile: string;
  chuongId?: number;
  nguoiUploadId: number;
  monHocId?: number;
  ngayUpload: string;
  chuong?: Chuong;
  monHoc?: MonHoc;
}

export interface CreateTaiLieuRequest {
  tenTaiLieu: string;
  moTa?: string;
  loaiTaiLieu: number;
  duongDanFile: string;
  chuongId?: number;
  monHocId?: number;
}

export interface UpdateTaiLieuRequest {
  tenTaiLieu?: string;
  moTa?: string;
  loaiTaiLieu?: number;
  chuongId?: number;
  monHocId?: number;
  trangThai?: boolean;
}

// Enrollment types
export interface SinhVienLopHoc {
  id: number;
  sinhVienId: number;
  lopHocId: number;
  ngayThamGia: string;
  trangThai: boolean;
  sinhVien?: SinhVien;
  lopHoc?: LopHoc;
}

export interface EnrollStudentRequest {
  sinhVienId: number;
  lopHocId: number;
}

// Progress types
export interface TienDoHocTap {
  id: number;
  sinhVienId: number;
  monHocId: number;
  hoanThanh: boolean;
  sinhVien?: SinhVien;
  monHoc?: MonHoc;
}

// Statistics types
export interface ThongKeTongQuan {
  tongSoGiangVien: number;
  tongSoSinhVien: number;
  tongSoMonHoc: number;
  tongSoLopHoc: number;
  tongSoBaiGiang: number;
  tongSoTaiLieu: number;
}

export interface ThongKeTheoThang {
  thang: number;
  nam: number;
  soGiangVienMoi: number;
  soSinhVienMoi: number;
  soMonHocMoi: number;
  soLopHocMoi: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Quiz types
export interface Quiz extends BaseEntity {
  tenBaiKiemTra: string;
  moTa?: string;
  thoiGianLamBai: number; // minutes
  soCauHoi: number;
  diemToiDa: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThaiQuiz: 'draft' | 'published' | 'closed';
  lopHocId: number;
  chuongId?: number;
  lopHoc?: LopHoc;
  chuong?: Chuong;
  questions?: Question[];
}

export interface CreateQuizRequest {
  tenBaiKiemTra: string;
  moTa?: string;
  thoiGianLamBai: number;
  diemToiDa: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  lopHocId: number;
  chuongId?: number;
}

export interface UpdateQuizRequest {
  tenBaiKiemTra?: string;
  moTa?: string;
  thoiGianLamBai?: number;
  diemToiDa?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThaiQuiz?: 'draft' | 'published' | 'closed';
  chuongId?: number;
}

export interface Question {
  id: number;
  noiDungCauHoi: string;
  loaiCauHoi: 'single_choice' | 'multiple_choice' | 'true_false';
  diemSo: number;
  baiKiemTraId: number;
  thuTu: number;
  ngayTao: string;
  answers?: Answer[];
}

export interface CreateQuestionRequest {
  noiDungCauHoi: string;
  loaiCauHoi: 'single_choice' | 'multiple_choice' | 'true_false';
  diemSo: number;
  baiKiemTraId: number;
  thuTu: number;
  answers: CreateAnswerRequest[];
}

export interface UpdateQuestionRequest {
  noiDungCauHoi?: string;
  loaiCauHoi?: 'single_choice' | 'multiple_choice' | 'true_false';
  diemSo?: number;
  thuTu?: number;
  answers?: Answer[];
}

export interface Answer {
  id: number;
  noiDungDapAn: string;
  laDapAnDung: boolean;
  cauHoiId: number;
  thuTu: number;
}

export interface CreateAnswerRequest {
  noiDungDapAn: string;
  laDapAnDung: boolean;
  thuTu: number;
}

export interface UpdateAnswerRequest {
  noiDungDapAn?: string;
  laDapAnDung?: boolean;
  thuTu?: number;
}

export interface QuizSubmission {
  id: number;
  sinhVienId: number;
  baiKiemTraId: number;
  thoiGianBatDau: string;
  thoiGianNopBai?: string;
  tongDiem?: number;
  trangThai: 'in_progress' | 'submitted' | 'graded';
  ngayTao: string;
  quiz?: Quiz;
  sinhVien?: SinhVien;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  baiLamId: number;
  cauHoiId: number;
  dapAnId?: number;
  diemDatDuoc: number;
  question?: Question;
  answer?: Answer;
}

export interface SubmitAnswerRequest {
  questionId: number;
  answerId: number;
}

export interface SaveProgressRequest {
  answers: Record<number, number>; // questionId -> answerId
}

export interface QuizResult {
  id: number;
  baiLamId: number;
  tongDiem: number;
  diemToiDa: number;
  phanTramDiem: number;
  thoiGianLamBai: number; // minutes
  soLuongCauDung: number;
  tongSoCau: number;
  danhGia: 'excellent' | 'good' | 'average' | 'poor' | 'fail';
  chiTietCauTraLoi: QuizAnswer[];
  quiz?: Quiz;
  sinhVien?: SinhVien;
}

export interface QuizAttempt {
  id: number;
  baiKiemTraId: number;
  sinhVienId: number;
  lanThu: number;
  tongDiem?: number;
  thoiGianBatDau: string;
  thoiGianKetThuc?: string;
  trangThai: 'in_progress' | 'completed' | 'timeout';
  quiz?: Quiz;
}

export interface QuizStatistics {
  baiKiemTraId: number;
  tongSoSinhVien: number;
  soSinhVienDaLam: number;
  soSinhVienChuaLam: number;
  diemTrungBinh: number;
  diemCaoNhat: number;
  diemThapNhat: number;
  tyLeDat: number; // percentage
  phanPhoiDiem: {
    khoangDiem: string;
    soLuong: number;
    tyLe: number;
  }[];
  thongKeCauHoi: {
    cauHoiId: number;
    noiDung: string;
    tyLeTraLoiDung: number;
    tyLeTraLoiSai: number;
    danhSachDapAnSai: {
      dapAnId: number;
      noiDung: string;
      soLuotChon: number;
    }[];
  }[];
} 