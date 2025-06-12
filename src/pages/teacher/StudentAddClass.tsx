import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, BookOpen } from "lucide-react";

const classOptions = [
  { id: 1, name: "Lớp 10A1" },
  { id: 2, name: "Lớp 11B2" },
];

const StudentAddClass: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hoTen: "",
    mssv: "",
    lopId: classOptions[0].id,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã thêm sinh viên vào lớp: " + JSON.stringify(form, null, 2));
    navigate("/teacher/classes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Thêm sinh viên vào lớp</h1>
            <p className="text-blue-100 text-base">Nhập thông tin sinh viên để thêm vào lớp học.</p>
          </div>
        </div>
        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Họ tên sinh viên</label>
            <input
              name="hoTen"
              value={form.hoTen}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập họ tên sinh viên"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Mã số sinh viên</label>
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
            <label className="block text-gray-700 mb-2 font-semibold">Lớp học</label>
            <select
              name="lopId"
              value={form.lopId}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            >
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base"
            >
              <UserPlus className="w-5 h-5" /> Thêm
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base"
              onClick={() => navigate("/teacher/classes")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAddClass; 