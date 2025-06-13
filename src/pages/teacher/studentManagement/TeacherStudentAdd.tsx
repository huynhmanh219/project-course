import React, { useState } from "react";
import { UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

const TeacherStudentAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mssv: "",
    email: "",
    status: true,
  });

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
    alert("Đã thêm sinh viên: " + JSON.stringify(form, null, 2));
    navigate("/teacher/students");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Thêm sinh viên</h1>
            <p className="text-blue-100 text-base">Nhập thông tin sinh viên để thêm mới.</p>
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
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/chapters')}
              className="px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl font-bold shadow hover:from-gray-500 hover:to-gray-700 transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition duration-200 flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherStudentAdd; 