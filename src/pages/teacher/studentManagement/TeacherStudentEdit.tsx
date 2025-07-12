import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, User, Loader2, AlertCircle } from "lucide-react";
import SimpleUserService from "../../../services/user.service.simple";

const TeacherStudentEdit: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);  
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    student_id: "",
    first_name: "",
    last_name: "",
    personal_email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    is_active: true
  });

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    if (!studentId) {
      setError("Không tìm thấy ID sinh viên");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await SimpleUserService.getStudent(parseInt(studentId));
      const student = response.student || response;
      const profile = student.profile || student;
      
      setForm({
        email: student.email || "",
        student_id: profile.student_id || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        personal_email: profile.personal_email || "",
        phone: profile.phone || "",
        date_of_birth: profile.date_of_birth || "",
        address: profile.address || "",
        is_active: student.is_active !== undefined ? student.is_active : true
      });
      
    } catch (error: any) {
      console.error("Fetch student error:", error);
      setError(error.message || "Lỗi khi tải thông tin sinh viên");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    setSaving(true);
    setError("");

    if (!form.student_id || !form.first_name || !form.last_name) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      setSaving(false);
      return;
    }

    try {
      const updateData: any = {
        student_id: form.student_id,
        first_name: form.first_name,
        last_name: form.last_name,
        is_active: form.is_active
      };
      
      if (form.personal_email.trim()) updateData.personal_email = form.personal_email.trim();
      if (form.phone.trim()) updateData.phone = form.phone.trim();
      if (form.date_of_birth) updateData.date_of_birth = form.date_of_birth;
      if (form.address.trim()) updateData.address = form.address.trim();
      
      await SimpleUserService.updateStudent(parseInt(studentId), updateData);
      alert("Cập nhật thành công!");
      navigate("/teacher/students");
      
    } catch (error: any) {
      setError(error.message || "Lỗi khi cập nhật thông tin sinh viên");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin sinh viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <User className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa thông tin sinh viên</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin sinh viên trong hệ thống LMS.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                MSSV <span className="text-red-500">*</span>
              </label>
              <input
                name="student_id"
                value={form.student_id}
                onChange={handleChange}
                required
                disabled={saving}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="VD: SV001, 2023001234"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Email cá nhân
              </label>
              <input
                name="personal_email"
                value={form.personal_email}
                onChange={handleChange}
                type="email"
                disabled={saving}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="student@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Họ và tên đệm <span className="text-red-500">*</span>
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                disabled={saving}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="VD: Nguyễn Văn"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                disabled={saving}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                placeholder="VD: An"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
              disabled={saving}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <label className="text-gray-700 font-semibold">Tài khoản hoạt động</label>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin bổ sung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Số điện thoại</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={saving}
                  className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Ngày sinh</label>
                <input
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  disabled={saving}
                  className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2 font-semibold">Địa chỉ</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={saving}
                rows={3}
                className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base disabled:bg-gray-100 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/teacher/students")}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl font-bold shadow hover:from-gray-500 hover:to-gray-700 transition duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold shadow-lg transition duration-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherStudentEdit;
