import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Edit2,  Loader2, Trash2 } from "lucide-react";
import { simpleCourseService } from "../../../services/course.service.simple";
import { authService } from "../../../services/auth.service";

interface Lecturer {
  id: number;
  profile: {
    first_name: string;
    last_name: string;
  };
  email: string;
}

interface Course {
  id: number;
  subject_name: string;
  description: string;
  subject_code: string;
  lecturer_id: number;
  credits: number;
  semester: string;
  academic_year: string;
  lecturer?: {
    id: number;
    first_name: string;
    last_name: string;
    title: string;
    department: string;
    account: {
      email: string;
    };
  };
}

const CourseEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<any>(null); void user;
  const [isAdmin, setIsAdmin] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  
  const [form, setForm] = useState({
    subject_name: '',
    description: '',
    subject_code: '',
    lecturer_id: 0,
    credits: 3,
    semester: 'fall',
    academic_year: '2024-2025'
  });

  // Load course data and lecturers
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user first
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          navigate('/login');
          return;
        }

        // Check if user is admin
        const userRole = currentUser.role || currentUser.roleName;
        setIsAdmin(userRole === 'admin');
        
        // Load course details first to check ownership
        const courseResponse = await simpleCourseService.getCourse(Number(id));
        
        console.log('Course data:', courseResponse);
        
        // Set course data - backend returns { data: { course: {...} } }
        const courseData = courseResponse.course || courseResponse;
        setCourse(courseData);
        
        // Check if user can edit this course
        const currentUserId = currentUser?.id;
        const currentLecturerId = currentUser?.lecturerId || currentUser?.lecturer_id;
        const canUserEdit = userRole === 'admin' || 
                           courseData.lecturer_id === currentUserId || 
                           courseData.lecturer_id === currentLecturerId;
        
        setCanEdit(canUserEdit);
        
        if (!canUserEdit) {
          setError('Bạn không có quyền chỉnh sửa môn học này. Chỉ admin hoặc giảng viên phụ trách mới có thể chỉnh sửa.');
          return;
        }
        
        setForm({
          subject_name: courseData.subject_name || '',
          description: courseData.description || '',
          subject_code: courseData.subject_code || '',
          lecturer_id: courseData.lecturer_id || 0,
          credits: courseData.credits || 3,
          semester: courseData.semester || 'fall',
          academic_year: courseData.academic_year || '2024-2025'
        });
        
        // Only load lecturers if admin (can change lecturer)
        if (userRole === 'admin') {
          const lecturersResponse = await simpleCourseService.getLecturers();
          setLecturers(lecturersResponse || []);
        }
        
      } catch (error: any) {
        console.error('Error loading data:', error);
        setError(error.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, navigate]);

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
    
    if (!canEdit) {
      setError('Bạn không có quyền chỉnh sửa môn học này.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      console.log('Updating course:', form);
      
      await simpleCourseService.updateCourse(Number(id), form);
      
      alert("Đã cập nhật môn học thành công!");
      navigate("/teacher/courses");
      
    } catch (error: any) {
      console.error('Error updating course:', error);
      setError(error.message || 'Không thể cập nhật môn học');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    
    if (!canEdit) {
      setError('Bạn không có quyền xóa môn học này.');
      return;
    }

    try {
      // First, check if course has active classes
      console.log('Checking classes for course:', id);
      const classes = await simpleCourseService.getClassesBySubject(Number(id));
      
      if (classes && classes.length > 0) {
        const classNames = classes.map((cls: any) => cls.section_name).join(', ');
        const confirmMessage = `Môn học "${course.subject_name}" có ${classes.length} lớp học đang hoạt động:\n\n${classNames}\n\nBạn cần xóa tất cả các lớp học này trước khi có thể xóa môn học.\n\nBạn có muốn chuyển đến trang "Quản lý lớp học" để xóa các lớp này không?`;
        
        if (window.confirm(confirmMessage)) {
          navigate('/teacher/classes');
        }
        return;
      }

      // If no classes, proceed with normal delete confirmation
      const confirmMessage = `Bạn có chắc chắn muốn xóa môn học "${course.subject_name}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
      
      if (window.confirm(confirmMessage)) {
        setDeleting(true);
        setError(null);
        
        console.log('Deleting course:', id);
        
        await simpleCourseService.deleteCourse(Number(id));
        
        alert("Đã xóa môn học thành công!");
        navigate("/teacher/courses");
      }
    } catch (error: any) {
      console.error('Error deleting course:', error);
      
      // Handle specific error messages
      let errorMessage = 'Không thể xóa môn học';
      if (error.message.includes('Cannot delete course with active sections')) {
        errorMessage = `Không thể xóa môn học "${course.subject_name}"!\n\nMôn học này vẫn còn có lớp học đang hoạt động. Vui lòng xóa tất cả các lớp học trước khi xóa môn học.\n\nBạn có thể vào mục "Quản lý lớp học" để xóa các lớp học liên quan.`;
        alert(errorMessage);
      } else {
        setError(error.message || errorMessage);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin môn học...</p>
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa môn học</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin môn học.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tên môn học</label>
            <input
              name="subject_name"
              value={form.subject_name}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập tên môn học"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Mã môn học</label>
            <input
              name="subject_code"
              value={form.subject_code}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập mã môn học (VD: CS101)"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập mô tả môn học"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Giảng viên phụ trách</label>
            {isAdmin ? (
              <select
                name="lecturer_id"
                value={form.lecturer_id}
                onChange={handleChange}
                required
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              >
                <option value={0}>Chọn giảng viên</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id -1}>
                    {lecturer.profile?.first_name} {lecturer.profile?.last_name} ({lecturer.email})
                  </option>
                ))}
              </select>
            ) : (
              <div className="border rounded-xl px-3 py-2 w-full bg-gray-100 text-gray-600 text-base">
                {course?.lecturer ? 
                  `${course.lecturer.first_name} ${course.lecturer.last_name} (${course.lecturer.account?.email})` :
                  'Thông tin giảng viên không có sẵn'
                }
                <input type="hidden" name="lecturer_id" value={form.lecturer_id} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Học kỳ</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            >
              <option value="fall">Học kỳ 1</option>
              <option value="spring">Học kỳ 2</option>
              <option value="summer">Học kỳ hè</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Năm học</label>
            <input
              name="academic_year"
              value={form.academic_year}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="2024-2025"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Số tín chỉ</label>
            <input
              name="credits"
              type="number"
              value={form.credits}
              onChange={handleChange}
              min={1}
              max={10}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="3"
            />
          </div>

          <div className="flex gap-3 justify-between">
            <button
              type="button"
              disabled={saving || deleting}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg text-base
                ${saving || deleting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                }`}
              onClick={handleDelete}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Xóa môn học
                </>
              )}
            </button>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || deleting}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg text-base
                  ${saving || deleting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Edit2 className="w-5 h-5" />
                    Cập nhật
                  </>
                )}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base"
              onClick={() => navigate("/teacher/courses")}
                disabled={saving || deleting}
            >
              Hủy
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEdit; 