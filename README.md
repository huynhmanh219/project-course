# Services Layer

Thư mục này chứa tất cả các services để gọi API và quản lý dữ liệu trong ứng dụng My Class.

## 📁 Cấu trúc thư mục

```
src/services/
├── api.ts                  # Cấu hình axios chung
├── types/
│   └── index.ts           # TypeScript interfaces/types
├── auth.service.ts        # Xử lý authentication
├── user.service.ts        # Quản lý người dùng (giảng viên, sinh viên)
├── course.service.ts      # Quản lý môn học và lớp học
├── lecture.service.ts     # Quản lý bài giảng và chương
├── material.service.ts    # Quản lý tài liệu
├── index.ts              # Export tất cả services
└── README.md             # Tài liệu hướng dẫn
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` trong root project:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### API Configuration

File `api.ts` cung cấp:
- Axios instance với base URL
- Request/Response interceptors
- Token authentication tự động
- Error handling chung

## 🚀 Cách sử dụng

### Import Services

```typescript
// Import tất cả services
import { authService, userService, courseService } from '@/services';

// Hoặc import riêng biệt
import authService from '@/services/auth.service';
```

### Authentication Service

```typescript
// Đăng nhập
const loginData = await authService.login({
  email: 'user@example.com',
  matKhau: 'password123'
});

// Kiểm tra xem đã đăng nhập chưa
const isLoggedIn = authService.isAuthenticated();

// Lấy thông tin user hiện tại
const currentUser = authService.getCurrentUser();

// Đăng xuất
await authService.logout();
```

### User Service

```typescript
// Lấy danh sách giảng viên
const teachers = await userService.getGiangViens({
  page: 1,
  limit: 10,
  search: 'Nguyễn'
});

// Tạo giảng viên mới
const newTeacher = await userService.createGiangVien({
  maGiangVien: 'GV001',
  hoTen: 'Nguyễn Văn A',
  email: 'a@example.com',
  khoaId: 1
});

// Upload avatar
const avatarUrl = await userService.uploadGiangVienAvatar(1, fileObject);
```

### Course Service

```typescript
// Lấy môn học của giảng viên
const courses = await courseService.getMonHocsByGiangVien(1);

// Tạo lớp học mới
const newClass = await courseService.createLopHoc({
  maLopHoc: 'LH001',
  tenLopHoc: 'Lớp Web Development',
  monHocId: 1,
  giangVienId: 1
});

// Thêm sinh viên vào lớp
await courseService.enrollStudent({
  sinhVienId: 1,
  lopHocId: 1
});
```

### Material Service

```typescript
// Upload tài liệu
const material = await materialService.uploadTaiLieu(fileObject, {
  tenTaiLieu: 'Bài giảng HTML',
  loaiTaiLieu: 1,
  chuongId: 1
});

// Tải xuống tài liệu
const blob = await materialService.downloadTaiLieu(1);

// Tìm kiếm tài liệu
const searchResults = await materialService.searchTaiLieus({
  keyword: 'HTML',
  loaiTaiLieu: 1
});
```

### Lecture Service

```typescript
// Lấy bài giảng theo môn học
const lectures = await lectureService.getBaiGiangsByMonHoc(1);

// Tạo chương mới
const chapter = await lectureService.createChuong({
  tenChuong: 'Giới thiệu HTML',
  baiGiangId: 1,
  thuTu: 1
});

// Export bài giảng
const pdfBlob = await lectureService.exportBaiGiang(1, 'pdf');
```

## 🔐 Authentication & Authorization

### Automatic Token Management

Services tự động:
- Thêm Bearer token vào headers
- Redirect về login khi token expired (401)
- Refresh token khi cần thiết

### Permission Checking

```typescript
// Kiểm tra quyền
const hasTeacherRole = authService.hasPermission('teacher');

// Kiểm tra lần đầu đăng nhập
const isFirstLogin = authService.isFirstLogin();
```

## 📊 Pagination & Filtering

Tất cả list APIs hỗ trợ pagination:

```typescript
const params = {
  page: 1,           // Trang hiện tại
  limit: 20,         // Số item per page
  search: 'keyword', // Tìm kiếm
  sortBy: 'name',    // Sort theo field
  sortOrder: 'asc'   // 'asc' hoặc 'desc'
};

const result = await userService.getGiangViens(params);
// result: { data: [], total: 100, page: 1, limit: 20, totalPages: 5 }
```

## 🛠️ Error Handling

### Automatic Error Handling

Services tự động xử lý:
- Network errors
- HTTP status errors (401, 403, 500)
- API response errors

### Custom Error Handling

```typescript
try {
  const data = await userService.getGiangVienById(1);
} catch (error) {
  console.error('Error:', error.message);
  // error có properties: message, status, errors
}
```

## 📝 TypeScript Support

Tất cả services có full TypeScript support:

```typescript
import type { 
  GiangVien, 
  CreateGiangVienRequest,
  PaginatedResponse 
} from '@/services/types';

const teacher: GiangVien = await userService.getGiangVienById(1);
const teachers: PaginatedResponse<GiangVien> = await userService.getGiangViens();
```

## 🔄 File Upload

Upload files với progress tracking:

```typescript
// Single file upload
const result = await materialService.uploadTaiLieu(file, {
  tenTaiLieu: 'Document.pdf',
  loaiTaiLieu: 1
});

// Multiple files upload
const results = await materialService.uploadMultipleTaiLieus(files, {
  loaiTaiLieu: 1,
  chuongId: 1
});
```

## 🎯 Best Practices

### 1. Sử dụng try-catch

```typescript
const handleLogin = async () => {
  try {
    const result = await authService.login(credentials);
    // Handle success
  } catch (error) {
    // Handle error
    setError(error.message);
  }
};
```

### 2. Loading States

```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await userService.getGiangViens();
    setUsers(data.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. Type Safety

```typescript
// Luôn sử dụng types
const createTeacher = async (data: CreateGiangVienRequest) => {
  return await userService.createGiangVien(data);
};
```

## 🔧 Customization

### Thêm Service mới

1. Tạo file `new.service.ts`
2. Implement class service
3. Export trong `index.ts`

```typescript
// new.service.ts
class NewService {
  async getData() {
    const response = await apiClient.get('/new-endpoint');
    return handleApiResponse(response);
  }
}

export const newService = new NewService();
export default newService;
```

### Mở rộng Types

```typescript
// types/index.ts
export interface NewEntity extends BaseEntity {
  name: string;
  description?: string;
}
```

## 📞 Support

Nếu có vấn đề hoặc cần hỗ trợ, hãy:
1. Kiểm tra console browser để xem error logs
2. Kiểm tra Network tab để xem API calls
3. Xem lại documentation này

---

**Note**: Đảm bảo backend API đã được implement và đang chạy trước khi sử dụng services. 