import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Edit2, Loader2, Trash2 } from "lucide-react";
import  {simpleClassService}  from "../../../services/class.service.simple";
import { simpleCourseService } from "../../../services/course.service.simple";
import { authService } from "../../../services/auth.service";

const ClassEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [classData, setClassData] = useState<any>(null);
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
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = authService.getCurrentUser();
        setCurrentUser(currentUser);
        
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        if (!['admin', 'lecturer'].includes(currentUser.role?.toLowerCase())) {
          setError('Bạn không có quyền chỉnh sửa lớp học phần');
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        const [classResponse, subjectsResponse, lecturersResponse] = await Promise.all([
          simpleClassService.getClass(Number(id)),
          simpleCourseService.getCourses(),
          currentUser.role?.toLowerCase() === 'admin' ? simpleCourseService.getLecturers() : Promise.resolve([])
        ]);
        

        
        const currentClass = classResponse.class || classResponse;
        setClassData(currentClass);
        
        const isAdmin = currentUser.role?.toLowerCase() === 'admin';
        
        let isAssignedLecturer = false;
        if (!isAdmin && currentUser.role?.toLowerCase() === 'lecturer') {
          try {
            const lecturerProfile = await simpleClassService.getCurrentLecturerProfile();
            isAssignedLecturer = currentClass.lecturer_id === lecturerProfile.lecturer_id;
            
         
          } catch (error: any) {
            setError('Không thể xác minh quyền truy cập. Vui lòng thử lại.');
            return;
          }
        }
        
        if (!isAdmin && !isAssignedLecturer) {
          setError('Bạn không có quyền chỉnh sửa lớp học phần này. Chỉ giảng viên được phân công hoặc admin mới có thể chỉnh sửa.');
          setTimeout(() => {
            navigate('/teacher/my-classes');
          }, 3000);
          return;
        }
        
        setForm({
          subject_id: currentClass.subject_id || 0,
          lecturer_id: currentClass.lecturer_id || 0,
          section_name: currentClass.section_name || '',
          max_students: currentClass.max_students || 50,
          start_date: currentClass.start_date || '',
          end_date: currentClass.end_date || '',
          schedule: currentClass.schedule || '',
          room: currentClass.room || ''
        });
        
        setSubjects(subjectsResponse.data || []);
        
        if (currentUser.role?.toLowerCase() === 'admin') {
          const sortedLecturers = (lecturersResponse || []).sort((a: any, b: any) => {
            const nameA = `${a.profile?.last_name || ''} ${a.profile?.first_name || ''}`.trim();
            const nameB = `${b.profile?.last_name || ''} ${b.profile?.first_name || ''}`.trim();
            return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
          });
          
          setLecturers(sortedLecturers);
        }
        
      } catch (error: any) {
        setError(error.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
    
      if (!form.section_name.trim()) {
        throw new Error('Tên lớp học phần là bắt buộc');
      }
      
      if (currentUser?.role?.toLowerCase() === 'admin' && (!form.lecturer_id || form.lecturer_id === 0)) {
        throw new Error('Vui lòng chọn giảng viên phụ trách');
      }
      
      if (!form.start_date) {
        throw new Error('Ngày bắt đầu là bắt buộc');
      }
      
      if (!form.end_date) {
        throw new Error('Ngày kết thúc là bắt buộc');
      }
      
      if (new Date(form.end_date) <= new Date(form.start_date)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      
      const updateData: any = {
        lecturer_id: form.lecturer_id,
        section_name: form.section_name.trim(),
        max_students: form.max_students,
        start_date: form.start_date,
        end_date: form.end_date
      };
      
      if (form.schedule?.trim()) updateData.schedule = form.schedule.trim();
      if (form.room?.trim()) updateData.room = form.room.trim();
      
      
      await simpleClassService.updateClass(Number(id), updateData);
      
      alert("Đã cập nhật lớp học thành công!");
      navigate("/teacher/my-classes");
      
    } catch (error: any) {
      
      let errorMessage = 'Không thể cập nhật lớp học phần';
      
      if (error.message.includes('You are not the instructor of this course')) {
        errorMessage = 'Bạn không có quyền chỉnh sửa lớp học phần này. Chỉ giảng viên được phân công hoặc admin mới có thể thực hiện thao tác này.';
      } else if (error.message.includes('Validation failed')) {
        if (error.validationErrors && Array.isArray(error.validationErrors)) {
          const errorDetails = error.validationErrors.map((err: any) => {
            if (typeof err === 'string') return err;
            if (err.msg) return `${err.param || 'Field'}: ${err.msg}`;
            if (err.message) return err.message;
            return JSON.stringify(err);
          }).join('\n');
          
          errorMessage = `Dữ liệu không hợp lệ:\n\n${errorDetails}`;
        } else {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.';
        }
      } else if (error.message.includes('Forbidden')) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!classData) return;

    try {

      const studentsResponse = await simpleClassService.getClassStudents(Number(id));
      
      if (studentsResponse.data && studentsResponse.data.length > 0) {
        const confirmMessage = `Lớp học "${classData.section_name}" có ${studentsResponse.data.length} sinh viên đang học.\n\nBạn cần xóa tất cả sinh viên khỏi lớp trước khi có thể xóa lớp học.\n\nBạn có muốn chuyển đến trang quản lý sinh viên không?`;
        
        if (window.confirm(confirmMessage)) {
          navigate(`/teacher/classes/${id}/students`);
        }
        return;
      }

      const confirmMessage = `Bạn có chắc chắn muốn xóa lớp học "${classData.section_name}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
      
      if (window.confirm(confirmMessage)) {
        setDeleting(true);
        setError(null);
        

        
        await simpleClassService.deleteClass(Number(id));
        
        alert("Đã xóa lớp học thành công!");
        navigate("/teacher/my-classes");
      }
    } catch (error: any) {
      
      let errorMessage = 'Không thể xóa lớp học';
      if (error.message.includes('Cannot delete class with enrolled students')) {
        errorMessage = `Không thể xóa lớp học "${classData.section_name}"!\n\nLớp học này vẫn còn có sinh viên đang học. Vui lòng xóa tất cả sinh viên khỏi lớp trước khi xóa lớp học.`;
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
          <p className="text-gray-600">Đang tải thông tin lớp học...</p>
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa lớp học phần</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin lớp học bạn phụ trách.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}



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
              disabled={true}
              className="border rounded-xl px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-base"
            >
              <option value={0}>Chọn môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name} ({subject.subject_code})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Không thể thay đổi môn học sau khi tạo lớp học phần
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Giảng viên phụ trách</label>
            {currentUser?.role?.toLowerCase() === 'admin' ? (
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
                    <option key={lecturer.id} value={lecturer.id - 1}>
                      {fullName} ({lecturer.email})
                    </option>
                  );
                })}
            </select>
            ) : (

              <div className="border rounded-xl px-3 py-2 w-full bg-gray-100 text-gray-700 text-base">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {classData?.lecturer ? 
                      `${classData.lecturer.last_name || ''} ${classData.lecturer.first_name || ''}`.trim() ||
                      `${currentUser?.last_name || ''} ${currentUser?.first_name || ''}`.trim() ||
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
                    ({classData?.lecturer?.title ? `${classData.lecturer.title} - ` : ''}{currentUser?.email})
                  </span>
                </div>
              </div>
            )}
            {currentUser?.role?.toLowerCase() !== 'admin' && (
              <p className="text-sm text-gray-500 mt-1">
                Chỉ admin mới có thể thay đổi giảng viên phụ trách
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
                  Xóa lớp học phần    
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
                onClick={() => navigate('/teacher/my-classes')}
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

export default ClassEdit; 