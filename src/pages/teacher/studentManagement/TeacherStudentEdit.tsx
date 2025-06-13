import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, User } from "lucide-react";

const fakeStudent = {
  name: "Nguyễn Văn A",
  mssv: "SV001",
  email: "a@student.edu",
  status: true,
};

const TeacherStudentEdit: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [form, setForm] = useState(fakeStudent);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã cập nhật sinh viên: " + JSON.stringify(form, null, 2));
    navigate("/teacher/students");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <User className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa sinh viên</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin sinh viên.</p>
          </div>
        </div>
        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Họ tên</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập họ tên sinh viên"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">MSSV</label>
            <input
              name="mssv"
              value={form.mssv}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập MSSV"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập email"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              name="status"
              type="checkbox"
              checked={form.status}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <label className="text-gray-700 font-semibold">Hoạt động</label>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base"
            >
              <Edit2 className="w-5 h-5" /> Lưu
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base"
              onClick={() => navigate("/teacher/students")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherStudentEdit; 