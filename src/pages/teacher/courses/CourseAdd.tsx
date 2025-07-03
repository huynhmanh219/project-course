import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Layers, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { authService } from "../../../services/auth.service";
import SimpleCourseService from "../../../services/course.service.simple";
import SimpleUserService from "../../../services/user.service.simple";
import { API_BASE_URL } from "../../../services/api";

const CourseAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenMonHoc: "",
    moTa: "",
    giangVienId: "",
    ngayTao: new Date().toISOString().slice(0, 10),
    soTinChi: 3,
    hocKy: "1",
    namHoc: new Date().getFullYear()
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [giangVienOptions, setGiangVienOptions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      console.log('🔍 Current user info:', currentUser);
      console.log('🔍 User role:', currentUser?.role);
      console.log('🔍 User permissions:', currentUser?.permissions);
      console.log('🔍 JWT Token:', authService.getToken()?.substring(0, 50) + '...');
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Check if user is admin
      const userRole = currentUser.role || currentUser.roleName;
      setIsAdmin(userRole === 'admin');
      console.log('User role:', userRole, 'Is admin:', userRole === 'admin');

      // Permission check and suggestion
      if (currentUser.role !== 'admin' && currentUser.role !== 'lecturer') {
        console.log('⚠️ User role might not have teachers access. Current role:', currentUser.role);
        setError(`Role hiện tại (${currentUser.role}) có thể không có quyền truy cập teachers API. Thử login với admin hoặc lecturer account.`);
      }

      // Only admin can select lecturers, lecturer automatically creates for themselves
      if (isAdmin) {
        // Fetch teachers list for admin
        console.log('🔍 Loading teachers list for admin...');
        try {
          const teachersResponse = await SimpleUserService.getTeachers();
          console.log('✅ Raw API response:', teachersResponse);
          console.log('✅ Response type:', typeof teachersResponse);
          console.log('✅ Response keys:', teachersResponse ? Object.keys(teachersResponse) : 'null/undefined');
          
          // Handle different possible response structures
          let teachersData = null;
          if (teachersResponse && teachersResponse.data) {
            teachersData = teachersResponse.data;
            console.log('✅ Found data in response.data:', teachersData);
          } else if (teachersResponse && Array.isArray(teachersResponse)) {
            teachersData = teachersResponse;
            console.log('✅ Response is direct array:', teachersData);
          } else if (teachersResponse && teachersResponse.teachers) {
            teachersData = teachersResponse.teachers;
            console.log('✅ Found data in response.teachers:', teachersData);
          } else {
            console.log('⚠️ Unexpected response structure:', teachersResponse);
          }
          
          if (teachersData && Array.isArray(teachersData) && teachersData.length > 0) {
            console.log('✅ Processing teachers data:', teachersData.length, 'teachers found');
            
            const processedTeachers = teachersData.map((teacher: any) => {
              console.log('🔍 Processing teacher:', teacher);
              
              // Handle different teacher object structures
              const teacherId = teacher.lecturer_id || teacher.id || teacher.account_id;
              const firstName = teacher.first_name || teacher.profile?.first_name || teacher.lecturer?.first_name;
              const lastName = teacher.last_name || teacher.profile?.last_name || teacher.lecturer?.last_name;
              const email = teacher.email || teacher.account?.email;
              const fullName = teacher.full_name || teacher.name || teacher.lecturer_name || `${firstName || ''} ${lastName || ''}`.trim();
              
              return {
                id: teacherId,
                name: fullName || 'Chưa có tên',
                email: email || 'Chưa có email'
              };
            });
            
            console.log('✅ Processed teachers:', processedTeachers);
            setGiangVienOptions(processedTeachers);
            
            // Set first teacher as default if available
            if (processedTeachers.length > 0) {
              setForm(prev => ({ ...prev, giangVienId: processedTeachers[0].id.toString() }));
            }
          } else {
            console.log('⚠️ No valid teachers data found');
            throw new Error('No teachers data received');
          }
        } catch (teacherError: any) {
          console.error('❌ Teachers API failed:', teacherError);
          
          // Fallback: Use mock teachers data
          console.log('🔧 Using fallback mock teachers data...');
          const mockTeachers = [
            { id: 1, name: "Nguyễn Văn A", email: "teacher1@lms.com" },
            { id: 2, name: "Trần Thị B", email: "teacher2@lms.com" },
            { id: 3, name: "Lê Hoàng C", email: "teacher3@lms.com" },
          ];
          setGiangVienOptions(mockTeachers);
          setForm(prev => ({ ...prev, giangVienId: mockTeachers[0].id.toString() }));
          
          // Show warning but don't fail completely
          setError('Không thể tải danh sách giảng viên từ server. Đang sử dụng dữ liệu mẫu.');
        }
      } else {
        // Lecturer automatically creates for themselves
        console.log('🔍 Lecturer creating course for themselves...');
        
        // Get lecturer profile to find correct lecturer_id
        try {
          const token = authService.getToken();
          const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const profileData = await response.json();
          
          if (response.ok && profileData?.status === 'success') {
            const lecturerId = profileData.data?.user?.profile?.id || currentUser.id;
            console.log('🔍 Lecturer profile info:', profileData);
            console.log('🔍 Using lecturer_id:', lecturerId);
            setForm(prev => ({ ...prev, giangVienId: lecturerId.toString() }));
          } else {
            console.log('⚠️ Could not get lecturer profile, using currentUser.id');
            setForm(prev => ({ ...prev, giangVienId: currentUser.id.toString() }));
          }
        } catch (profileError) {
          console.log('⚠️ Profile API error, using currentUser.id:', profileError);
          setForm(prev => ({ ...prev, giangVienId: currentUser.id.toString() }));
        }
      }
    } catch (error: any) {
      console.error('❌ Error loading initial data:', error);
      setError('Không thể tải dữ liệu ban đầu: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check permission before submit
    const currentUser = authService.getCurrentUser();
    console.log('🚀 SUBMIT - Current user:', currentUser);
    console.log('🚀 SUBMIT - User role:', currentUser?.role);
    console.log('🚀 SUBMIT - JWT Token exists:', !!authService.getToken());
    
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'lecturer') {
      setError(`❌ Cần admin hoặc lecturer role để tạo course. Role hiện tại: ${currentUser?.role}. Hãy login với admin@lms.com / admin123 hoặc teacher account.`);
      return;
    }
    
    if (!form.tenMonHoc.trim()) {
      setError('Vui lòng nhập tên môn học');
      return;
    }
    
    if (!form.giangVienId) {
      setError('Vui lòng chọn giảng viên phụ trách');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Creating course with data:', form);
      
      // Prepare course data for API
      const courseData = {
        subject_name: form.tenMonHoc,
        subject_code: form.tenMonHoc.replace(/\s+/g, '').toUpperCase().substring(0, 10), // Generate code from name
        description: form.moTa || '',
        credits: parseInt(form.soTinChi.toString()),
        lecturer_id: parseInt(form.giangVienId.toString()),
        // Convert Vietnamese semester to English
        semester: form.hocKy === '1' ? 'fall' : form.hocKy === '2' ? 'spring' : 'summer',
        // Convert to YYYY-YYYY format
        academic_year: `${form.namHoc}-${parseInt(form.namHoc.toString()) + 1}`
      };

      console.log('Sending course data to API:', courseData);
      
      // Call API to create course
      const response = await SimpleCourseService.createCourse(courseData);
      console.log('Create course response:', response);

      if (response) {
        alert("Đã tạo môn học thành công!");
        navigate("/teacher/courses");
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error: any) {
      console.error('Error creating course:', error);
      
      // Check if it's a validation error with specific details
      if (error.validationErrors && Array.isArray(error.validationErrors)) {
        setError('Lỗi validation: ' + error.validationErrors.join(', '));
      } else if (error.message.includes('Validation failed')) {
        setError('Lỗi validation dữ liệu. Vui lòng kiểm tra lại thông tin nhập vào.');
      } else {
        setError('Lỗi khi tạo môn học: ' + (error.message || 'Vui lòng thử lại'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
              {isAdmin ? "Thêm môn học" : "Tạo môn học"}
            </h1>
            <p className="text-blue-100 text-base">
              Chào mừng {user?.userName || user?.email}, {isAdmin ? "tạo mới một môn học cho hệ thống" : "tạo môn học mà bạn phụ trách"}
            </p>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Tên môn học <span className="text-red-500">*</span>
            </label>
            <input
              name="tenMonHoc"
              value={form.tenMonHoc}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập tên môn học (VD: Toán cao cấp A1)"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Mô tả</label>
            <textarea
              name="moTa"
              value={form.moTa}
              onChange={handleChange}
              rows={3}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập mô tả môn học"
            />
          </div>
          
          {isAdmin ? (
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Giảng viên phụ trách <span className="text-red-500">*</span>
              </label>
              <select
                name="giangVienId"
                value={form.giangVienId}
                onChange={handleChange}
                required
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              >
                <option value="">-- Chọn giảng viên --</option>
                {giangVienOptions.map((gv) => (
                  <option key={gv.id} value={gv.id-1}>
                    {gv.name} ({gv.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Giảng viên phụ trách
              </label>
              <div className="border rounded-xl px-3 py-2 w-full bg-gray-100 text-gray-600 text-base">
                {user?.userName || user?.email} (Bạn - Giảng viên tạo môn học)
              </div>
              <input type="hidden" name="giangVienId" value={form.giangVienId} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Số tín chỉ</label>
              <select
                name="soTinChi"
                value={form.soTinChi}
                onChange={handleChange}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              >
                <option value={1}>1 tín chỉ</option>
                <option value={2}>2 tín chỉ</option>
                <option value={3}>3 tín chỉ</option>
                <option value={4}>4 tín chỉ</option>
                <option value={5}>5 tín chỉ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Học kỳ</label>
              <select
                name="hocKy"
                value={form.hocKy}
                onChange={handleChange}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              >
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
                <option value="3">Học kỳ hè</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Năm học</label>
              <input
                name="namHoc"
                value={form.namHoc}
                onChange={handleChange}
                type="number"
                min={2020}
                max={2030}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Ngày tạo</label>
            <input
              name="ngayTao"
              value={form.ngayTao}
              onChange={handleChange}
              type="date"
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Tạo môn học
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2 rounded-xl font-semibold text-base"
              onClick={() => navigate("/teacher/courses")}
              disabled={loading}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseAdd; 