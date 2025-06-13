import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Edit2 } from "lucide-react";

const courseOptions = [
  { id: 1, name: 'Toán 10' },
  { id: 2, name: 'Văn 11' },
];
const teacherOptions = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
];

const fakeClass = {
  name: 'Lớp 10A1',
  courseId: 1,
  teacherId: 1,
  description: 'Lớp chuyên Toán',
  status: true,
};

const ClassEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(fakeClass);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật lớp học: ' + JSON.stringify(form, null, 2));
    navigate('/teacher/my-classes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa lớp học</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin lớp học bạn phụ trách.</p>
          </div>
        </div>
        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tên lớp</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base" placeholder="Nhập tên lớp học" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Môn học</label>
            <select name="courseId" value={form.courseId} onChange={handleChange} className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base">
              {courseOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Giảng viên</label>
            <select name="teacherId" value={form.teacherId} onChange={handleChange} className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base">
              {teacherOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base" placeholder="Nhập mô tả lớp học" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base">
              <Edit2 className="w-5 h-5" /> Lưu
            </button>
            <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base" onClick={() => navigate('/teacher/my-classes')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassEdit; 