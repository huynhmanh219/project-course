import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const fakeStudent = {
  hoTen: "Nguyễn Văn A",
  mssv: "SV001",
  hinhAnh: "avatar1.png",
  trangThai: true,
};

const TeacherStudentEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id, studentId } = useParams();
  const [form, setForm] = useState(fakeStudent);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, hinhAnh: e.target.files[0].name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã cập nhật sinh viên: " + JSON.stringify(form, null, 2));
    navigate(`/teacher/classes/${id}/students`);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sửa sinh viên</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Họ tên</label>
          <input name="hoTen" value={form.hoTen} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">MSSV</label>
          <input name="mssv" value={form.mssv} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Ảnh đại diện</label>
          <input name="hinhAnh" type="file" accept="image/*" onChange={handleImageChange} className="border rounded px-2 py-1 w-full" />
          {form.hinhAnh && <div className="mt-2 text-sm text-gray-500">Đã chọn: {form.hinhAnh}</div>}
        </div>
        <div className="flex items-center gap-2">
          <input name="trangThai" type="checkbox" checked={form.trangThai} onChange={handleChange} />
          <label className="text-gray-700">Hoạt động</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate(`/teacher/classes/${id}/students`)}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default TeacherStudentEdit; 