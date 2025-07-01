import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import { simpleClassService } from "../../../services/class.service.simple";
import { simpleCourseService } from "../../../services/course.service.simple";
import { authService } from "../../../services/auth.service";

const ClassAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [form, setForm] = useState({
    subject_id: 0,
    lecturer_id: 0,
    section_name: "",
    max_students: 50,
    start_date: "",
    end_date: "",
    schedule: "",
    room: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // CRITICAL: Refresh user data từ server để đảm bảo data đúng
      console.log('🔄 Refreshing user data from server...');
      const freshUser = await authService.refreshUserData();
      setCurrentUser(freshUser);
      
      if (!freshUser) {
        navigate('/login');
        return;
      }
      
      console.log('✅ Using fresh user data:', freshUser);
      
      // Check if user has permission to create classes
      if (!['admin', 'lecturer'].includes(freshUser.role?.toLowerCase())) {
        setError('Bạn không có quyền tạo lớp học phần');
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      // Load subjects and lecturers in parallel
      const [subjectsResponse, lecturersResponse] = await Promise.all([
        simpleCourseService.getCourses(),
        freshUser.role?.toLowerCase() === 'admin' ? simpleCourseService.getLecturers() : Promise.resolve([])
      ]);
      
      console.log('🔄 Subjects data:', subjectsResponse);
      console.log('🔄 Lecturers data:', lecturersResponse);
      console.log('👤 Fresh user:', freshUser);
      
      // Set subjects
      const subjectsData = subjectsResponse.data || [];
      setSubjects(subjectsData);
      
      // Handle lecturer selection based on role
      if (freshUser.role?.toLowerCase() === 'admin') {
        // Admin can select any lecturer
        const sortedLecturers = (lecturersResponse || []).sort((a: any, b: any) => {
          const nameA = `${a.profile?.last_name || ''} ${a.profile?.first_name || ''}`.trim();
          const nameB = `${b.profile?.last_name || ''} ${b.profile?.first_name || ''}`.trim();
          return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
        });
        setLecturers(sortedLecturers);
      } else {
        // Lecturer can only create classes for themselves
        // Get lecturer profile to get correct lecturer_id
        try {
          const lecturerProfile = await simpleClassService.getCurrentLecturerProfile();
          setForm(prev => ({ 
            ...prev, 
            lecturer_id: lecturerProfile.lecturer_id // Use lecturer table ID, not account ID
          }));
          console.log('✅ Set lecturer_id for current user:', lecturerProfile.lecturer_id);
        } catch (error: any) {
          console.error('❌ Failed to get lecturer profile:', error);
          setError('Không thể lấy thông tin giảng viên. Vui lòng thử lại.');
          return;
        }
      }
      
      // Set default subject_id if available
      if (subjectsData.length > 0) {
        setForm(prev => ({ ...prev, subject_id: subjectsData[0].id }));
      }
      
    } catch (error: any) {
      console.error('❌ Error loading data:', error);
      setError(error.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Additional validation
      if (!form.section_name.trim()) {
        throw new Error('Tên lớp học phần là bắt buộc');
      }
      
      if (!form.subject_id || form.subject_id === 0) {
        throw new Error('Vui lòng chọn môn học');
      }
      
      // For admin, lecturer_id must be selected
      // For lecturer, lecturer_id is auto-set
      if (currentUser?.role?.toLowerCase() === 'admin' && (!form.lecturer_id || form.lecturer_id === 0)) {
        throw new Error('Vui lòng chọn giảng viên phụ trách');
      }
      
      // Validate required dates
      if (!form.start_date) {
        throw new Error('Ngày bắt đầu là bắt buộc');
      }
      
      if (!form.end_date) {
        throw new Error('Ngày kết thúc là bắt buộc');
      }
      
      // Validate date logic
      if (new Date(form.end_date) <= new Date(form.start_date)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      
      // Clean up form data before sending
      const cleanFormData: any = {
        subject_id: form.subject_id,
        lecturer_id: form.lecturer_id,
        section_name: form.section_name.trim(),
        max_students: form.max_students,
        start_date: form.start_date,
        end_date: form.end_date
      };
      
      // Only include optional fields if they have values
      if (form.schedule?.trim()) {
        cleanFormData.schedule = form.schedule.trim();
      }
      
      if (form.room?.trim()) {
        cleanFormData.room = form.room.trim();
      }
      
      console.log('✅ Creating class with clean data:', cleanFormData);
      console.log('👤 Current user role:', currentUser?.role);
      
      await simpleClassService.createClass(cleanFormData);
      
      alert("Đã tạo lớp học thành công!");
      navigate("/teacher/my-classes");
      
    } catch (error: any) {
      console.error('❌ Error creating class:', error);
      setError(error.message || 'Không thể tạo lớp học');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Thêm lớp học phần</h1>
            <p className="text-blue-100 text-base">Tạo mới một lớp học cho khoá học bạn phụ trách.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* DEBUG SECTION - XÓA SAU KHI FIX XONG */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">🐛 DEBUG INFO:</h3>
          <button 
            onClick={() => {
              console.log('=== DEBUG USER INFO ===');
              console.log('Current user from state:', currentUser);
              console.log('User from localStorage:', authService.getCurrentUser());
              console.log('LocalStorage raw:', localStorage.getItem('user'));
              console.log('Token exists:', !!authService.getToken());
              console.log('Token expired:', authService.isTokenExpired());
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2"
          >
            Debug Current User
          </button>
          <button 
            onClick={async () => {
              try {
                console.log('=== REFRESHING USER DATA ===');
                const fresh = await authService.refreshUserData();
                setCurrentUser(fresh);
                console.log('Fresh user set:', fresh);
              } catch (error) {
                console.error('Refresh failed:', error);
              }
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Refresh User Data
          </button>
          <p className="text-sm mt-2">
            <strong>Current Email:</strong> {currentUser?.email || 'Unknown'} <br/>
            <strong>Current Role:</strong> {currentUser?.role || 'Unknown'} <br/>
            <strong>Profile Name:</strong> {currentUser?.profile ? 
              `${currentUser.profile.last_name} ${currentUser.profile.first_name}` : 'No profile'}
          </p>
        </div>

        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tên lớp học phần</label>
            <input
              name="section_name"
              value={form.section_name}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Ví dụ: CS101-01, MATH-A1"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Môn học</label>
            <select
              name="subject_id"
              value={form.subject_id}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            >
              <option value={0}>Chọn môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id - 1}>
                  {subject.subject_name} ({subject.subject_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Giảng viên phụ trách</label>
            {currentUser?.role?.toLowerCase() === 'admin' ? (
              // Admin can select any lecturer
              <select
                name="lecturer_id"
                value={form.lecturer_id}
                onChange={handleChange}
                required
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              >
                <option value={0}>Chọn giảng viên</option>
                {lecturers.map((lecturer) => {
                  const lastName = lecturer.profile?.last_name || '';
                  const firstName = lecturer.profile?.first_name || '';
                  const fullName = `${lastName} ${firstName}`.trim() || 'Chưa cập nhật tên';
                  
                  return (
                    <option key={lecturer.id} value={lecturer.id}>
                      {fullName} ({lecturer.email})
                    </option>
                  );
                })}
              </select>
            ) : (
              // Lecturer sees their own info and cannot change
              <div className="border rounded-xl px-3 py-2 w-full bg-gray-100 text-gray-700 text-base">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {currentUser?.profile ? 
                      `${currentUser.profile.last_name || ''} ${currentUser.profile.first_name || ''}`.trim() ||
                      currentUser?.userName || 
                      currentUser?.email || 
                      'Bạn'
                      :
                      `${currentUser?.last_name || ''} ${currentUser?.first_name || ''}`.trim() ||
                      currentUser?.userName || 
                      currentUser?.email || 
                      'Bạn'
                    }
                  </span>
                  <span className="text-sm text-gray-500">
                    ({currentUser?.profile?.title ? `${currentUser.profile.title} - ` : ''}{currentUser?.email})
                  </span>
                </div>
              </div>
            )}
            {currentUser?.role?.toLowerCase() !== 'admin' && (
              <p className="text-sm text-gray-500 mt-1">
                Bạn chỉ có thể tạo lớp học phần cho chính mình
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Số sinh viên tối đa</label>
            <input
              name="max_students"
              type="number"
              value={form.max_students}
              onChange={handleChange}
              min={1}
              max={200}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                required
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Phòng học</label>
            <input
              name="room"
              value={form.room}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Ví dụ: A101, B205"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Lịch học</label>
            <textarea
              name="schedule"
              value={form.schedule}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Ví dụ: Thứ 2, 4, 6: 8:00 - 10:00"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg text-base
                ${saving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Tạo lớp học phần
                </>
              )}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base"
              onClick={() => navigate("/teacher/my-classes")}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassAdd; 