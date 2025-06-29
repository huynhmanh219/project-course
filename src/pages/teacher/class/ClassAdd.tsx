import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import { simpleClassService } from "../../../services/class.service.simple";
import { simpleCourseService } from "../../../services/course.service.simple";

const ClassAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  
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
      
      // Load subjects and lecturers in parallel
      const [subjectsResponse, lecturersResponse] = await Promise.all([
        simpleCourseService.getCourses(),
        simpleCourseService.getLecturers()
      ]);
      
      console.log('Subjects data:', subjectsResponse);
      console.log('Lecturers data:', lecturersResponse);
      
      // Set subjects
      const subjectsData = subjectsResponse.data || [];
      setSubjects(subjectsData);
      
      // Sort lecturers by full name (Vietnamese style: last_name first_name)
      const sortedLecturers = (lecturersResponse || []).sort((a: any, b: any) => {
        const nameA = `${a.profile?.last_name || ''} ${a.profile?.first_name || ''}`.trim();
        const nameB = `${b.profile?.last_name || ''} ${b.profile?.first_name || ''}`.trim();
        return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
      });
      
      setLecturers(sortedLecturers);
      
      // Set default subject_id if available
      if (subjectsData.length > 0) {
        setForm(prev => ({ ...prev, subject_id: subjectsData[0].id }));
      }
      
    } catch (error: any) {
      console.error('Error loading data:', error);
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
      
      console.log('Creating class:', form);
      
      await simpleClassService.createClass(form);
      
      alert("Đã tạo lớp học thành công!");
      navigate("/teacher/classes");
      
    } catch (error: any) {
      console.error('Error creating class:', error);
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
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name} ({subject.subject_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Giảng viên phụ trách</label>
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
                  <option key={lecturer.id} value={lecturer.id-1}>
                    {fullName} ({lecturer.email})
                  </option>
                );
              })}
            </select>
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
              <label className="block text-gray-700 mb-2 font-semibold">Ngày bắt đầu</label>
              <input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Ngày kết thúc</label>
              <input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
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