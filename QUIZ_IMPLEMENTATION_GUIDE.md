# 🎯 Hướng dẫn triển khai hệ thống Quiz/Trắc nghiệm

## 📋 Tổng quan
Đây là hướng dẫn triển khai hoàn chỉnh cho chức năng làm bài trắc nghiệm trong hệ thống My Class LMS.

## 🗄️ 1. Database Schema

### Các bảng cần tạo:

```sql
-- Bảng đề thi/bài kiểm tra
CREATE TABLE BaiKiemTra (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Ten_Bai_Kiem_Tra VARCHAR(255) NOT NULL,
    Mo_Ta TEXT,
    Thoi_Gian_Lam_Bai INT, -- phút
    So_Cau_Hoi INT,
    Diem_Toi_Da DECIMAL(5,2),
    Ngay_Bat_Dau DATETIME,
    Ngay_Ket_Thuc DATETIME,
    Trang_Thai ENUM('draft', 'published', 'closed'),
    Lop_Hoc_ID INT,
    Chuong_ID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Lop_Hoc_ID) REFERENCES LopHoc(ID),
    FOREIGN KEY (Chuong_ID) REFERENCES Chuong(ID)
);

-- Bảng câu hỏi
CREATE TABLE CauHoi (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Noi_Dung_Cau_Hoi TEXT NOT NULL,
    Loai_Cau_Hoi ENUM('single_choice', 'multiple_choice', 'true_false'),
    Diem_So DECIMAL(5,2) DEFAULT 1,
    Bai_Kiem_Tra_ID INT,
    Thu_Tu INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Bai_Kiem_Tra_ID) REFERENCES BaiKiemTra(ID)
);

-- Bảng đáp án
CREATE TABLE DapAn (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Noi_Dung_Dap_An TEXT NOT NULL,
    La_Dap_An_Dung BOOLEAN DEFAULT FALSE,
    Cau_Hoi_ID INT,
    Thu_Tu INT,
    FOREIGN KEY (Cau_Hoi_ID) REFERENCES CauHoi(ID)
);

-- Bảng bài làm của sinh viên
CREATE TABLE BaiLam (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Sinh_Vien_ID INT,
    Bai_Kiem_Tra_ID INT,
    Thoi_Gian_Bat_Dau DATETIME,
    Thoi_Gian_Nop_Bai DATETIME,
    Tong_Diem DECIMAL(5,2),
    Trang_Thai ENUM('in_progress', 'submitted', 'graded'),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Sinh_Vien_ID) REFERENCES SinhVien(ID),
    FOREIGN KEY (Bai_Kiem_Tra_ID) REFERENCES BaiKiemTra(ID)
);

-- Bảng câu trả lời của sinh viên
CREATE TABLE CauTraLoi (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Bai_Lam_ID INT,
    Cau_Hoi_ID INT,
    Dap_An_ID INT, -- NULL nếu chưa trả lời
    Diem_Dat_Duoc DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (Bai_Lam_ID) REFERENCES BaiLam(ID),
    FOREIGN KEY (Cau_Hoi_ID) REFERENCES CauHoi(ID),
    FOREIGN KEY (Dap_An_ID) REFERENCES DapAn(ID)
);
```

## 🔧 2. Đã triển khai

### ✅ Services Layer
- `src/services/quiz.service.ts` - API calls cho quiz
- `src/services/types/index.ts` - TypeScript interfaces
- `src/services/index.ts` - Export quiz service

### ✅ UI Components  
- `src/pages/teacher/quiz/QuizManagement.tsx` - Quản lý đề thi
- `src/pages/student/quiz/QuizTaking.tsx` - Làm bài thi
- `src/components/Sidebar.tsx` - Thêm menu Quiz

## 📁 3. Cấu trúc file cần tạo thêm

### Teacher Components:
```
src/pages/teacher/quiz/
├── QuizManagement.tsx ✅
├── QuizAdd.tsx
├── QuizEdit.tsx  
├── QuizDetail.tsx
├── QuestionAdd.tsx
├── QuestionEdit.tsx
└── QuizResults.tsx
```

### Student Components:
```
src/pages/student/quiz/
├── QuizList.tsx
├── QuizTaking.tsx ✅
├── QuizResult.tsx
└── QuizHistory.tsx
```

## 🎨 4. Tính năng chính

### Cho Giáo viên:
- ✅ Xem danh sách bài kiểm tra
- 🔄 Tạo bài kiểm tra mới
- 🔄 Chỉnh sửa bài kiểm tra
- 🔄 Thêm/sửa câu hỏi và đáp án
- ✅ Xuất bản/đóng bài thi
- 🔄 Xem kết quả và thống kê
- 🔄 Export kết quả

### Cho Sinh viên:
- 🔄 Xem danh sách bài thi có thể làm
- ✅ Làm bài thi với timer
- ✅ Điều hướng câu hỏi
- ✅ Đánh dấu câu hỏi
- ✅ Auto-save progress
- 🔄 Xem kết quả chi tiết
- 🔄 Lịch sử làm bài

## 🔗 5. API Endpoints cần implement

### Quiz Management:
```
GET    /api/quiz                    - Lấy danh sách quiz
POST   /api/quiz                    - Tạo quiz mới
GET    /api/quiz/:id                - Lấy chi tiết quiz
PUT    /api/quiz/:id                - Cập nhật quiz
DELETE /api/quiz/:id                - Xóa quiz
PATCH  /api/quiz/:id/publish        - Xuất bản quiz
PATCH  /api/quiz/:id/close          - Đóng quiz
```

### Question Management:
```
GET    /api/quiz/:id/questions      - Lấy câu hỏi của quiz
POST   /api/quiz/questions          - Tạo câu hỏi mới
PUT    /api/quiz/questions/:id      - Cập nhật câu hỏi
DELETE /api/quiz/questions/:id      - Xóa câu hỏi
```

### Student Quiz Taking:
```
GET    /api/quiz/available          - Lấy quiz available cho student
POST   /api/quiz/:id/start          - Bắt đầu làm bài
POST   /api/quiz/submission/:id/answer - Submit câu trả lời
POST   /api/quiz/submission/:id/save   - Lưu progress
POST   /api/quiz/submission/:id/submit - Nộp bài
GET    /api/quiz/submission/:id/result - Xem kết quả
```

## 🚀 6. Bước triển khai tiếp theo

### Ngay lập tức:
1. **Tạo database tables** theo schema trên
2. **Implement QuizAdd.tsx** - Form tạo đề thi mới
3. **Implement QuestionAdd.tsx** - Form thêm câu hỏi
4. **Tạo API endpoints** cơ bản cho CRUD quiz

### Tuần tới:
1. **QuizList.tsx** - Danh sách bài thi cho student
2. **QuizResult.tsx** - Hiển thị kết quả chi tiết
3. **QuizResults.tsx** - Thống kê cho teacher
4. **Implement timer logic** và auto-submit

### Nâng cao:
1. **Question randomization** - Trộn câu hỏi
2. **Multiple attempts** - Cho phép làm lại nhiều lần
3. **Question pools** - Ngân hàng câu hỏi
4. **Advanced analytics** - Phân tích chi tiết
5. **Export results** - Xuất kết quả Excel/PDF

## 💡 7. Đề xuất cải tiến

### UX/UI Improvements:
- **Rich text editor** cho câu hỏi (support LaTeX cho toán học)
- **Image upload** cho câu hỏi và đáp án
- **Progress indicators** rõ ràng hơn
- **Mobile responsive** tối ưu cho điện thoại

### Tính năng nâng cao:
- **Question categories** - Phân loại câu hỏi theo chủ đề
- **Difficulty levels** - Mức độ khó
- **Adaptive testing** - Câu hỏi thích ứng theo năng lực
- **Anti-cheating measures** - Chống gian lận
- **Collaborative reviewing** - Giáo viên review chéo

### Performance:
- **Caching strategies** cho câu hỏi
- **Offline support** - Làm bài offline
- **Real-time sync** - Đồng bộ real-time
- **Load balancing** cho nhiều user đồng thời

## 📊 8. Metrics & Analytics

### Teacher Dashboard:
- Tỷ lệ hoàn thành bài thi
- Phân bố điểm số
- Câu hỏi khó nhất/dễ nhất
- Thời gian làm bài trung bình
- So sánh giữa các lớp

### Student Progress:
- Lịch sử điểm số
- Xu hướng cải thiện
- So sánh với lớp
- Điểm mạnh/yếu theo chủ đề

## 🔒 9. Security & Performance

### Security:
- **Authentication** - Xác thực người dùng
- **Authorization** - Phân quyền truy cập
- **Input validation** - Validate dữ liệu đầu vào
- **SQL injection prevention** - Bảo mật database
- **Session management** - Quản lý phiên làm việc

### Performance:
- **Database indexing** - Index các field quan trọng
- **Query optimization** - Tối ưu câu query
- **Caching** - Cache kết quả thường dùng
- **Image optimization** - Tối ưu hình ảnh
- **Code splitting** - Chia nhỏ bundle JS

---

**Status:** 🟡 Đang triển khai - Đã hoàn thành foundation
**Next Priority:** 🔥 QuizAdd.tsx và API endpoints 