import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const fakeCourse = {
  tenKhoaHoc: "Toán 10",
  chuong: "Chương 1",
  noiDung: "Nội dung chương 1",
  moTa: "Khóa học Toán nâng cao",
  ngayBatDau: "2024-06-01",
  ngayKetThuc: "2024-07-01",
  trangThai: true,
};

const CourseEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(fakeCourse);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã cập nhật khóa học: " + JSON.stringify(form, null, 2));
    navigate('/teacher/courses');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sửa khóa học</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Tên khóa học</label>
          <input name="tenKhoaHoc" value={form.tenKhoaHoc} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Chương</label>
          <input name="chuong" value={form.chuong} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Nội dung</label>
          <textarea name="noiDung" value={form.noiDung} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea name="moTa" value={form.moTa} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Ngày bắt đầu</label>
          <input name="ngayBatDau" value={form.ngayBatDau} onChange={handleChange} required className="border rounded px-2 py-1 w-full" type="date" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Ngày kết thúc</label>
          <input name="ngayKetThuc" value={form.ngayKetThuc} onChange={handleChange} required className="border rounded px-2 py-1 w-full" type="date" />
        </div>
        <div className="flex items-center gap-2">
          <input name="trangThai" type="checkbox" checked={form.trangThai} onChange={handleChange} />
          <label className="text-gray-700">Hoạt động</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate('/teacher/courses')}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default CourseEdit; 