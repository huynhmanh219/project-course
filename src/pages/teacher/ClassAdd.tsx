import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const courseOptions = [
  { id: 1, name: 'Toán 10' },
  { id: 2, name: 'Văn 11' },
];
const teacherOptions = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
];

const ClassAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    courseId: courseOptions[0].id,
    teacherId: teacherOptions[0].id,
    description: '',
    status: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm lớp học: ' + JSON.stringify(form, null, 2));
    navigate('/admin/classes');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Thêm sinh viên vào lớp</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Tên sinh viên</label>
          <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Khóa học</label>
          <select name="courseId" value={form.courseId} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            {courseOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Giảng viên</label>
          <select name="teacherId" value={form.teacherId} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            {teacherOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <input name="status" type="checkbox" checked={form.status} onChange={handleChange} />
          <label className="text-gray-700">Hoạt động</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate('/admin/classes')}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default ClassAdd; 