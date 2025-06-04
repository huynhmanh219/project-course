import React, { useState } from 'react';

const teacherOptions = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
];

const initialCourses = [
  { name: 'Toán 10', teacherId: 1, startDate: '2024-06-01', endDate: '2024-07-01', description: 'Khóa học Toán nâng cao', status: true },
  { name: 'Văn 11', teacherId: 2, startDate: '2024-06-10', endDate: '2024-07-10', description: 'Khóa học Văn cơ bản', status: false },
];

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [form, setForm] = useState({ name: '', teacherId: teacherOptions[0].id, startDate: '', endDate: '', description: '', status: true });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type} = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAdd = () => {
    setForm({ name: '', teacherId: teacherOptions[0].id, startDate: '', endDate: '', description: '', status: true });
    setEditIdx(null);
    setShowForm(true);
  };

  const handleEdit = (idx: number) => {
    setForm(courses[idx]);
    setEditIdx(idx);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIdx(null);
    setForm({ name: '', teacherId: teacherOptions[0].id, startDate: '', endDate: '', description: '', status: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx !== null) {
      const newCourses = [...courses];
      newCourses[editIdx] = { ...form, teacherId: Number(form.teacherId) };
      setCourses(newCourses);
    } else {
      setCourses([
        ...courses,
        { ...form, teacherId: Number(form.teacherId) },
      ]);
    }
    handleCancel();
  };

  const handleDelete = (idx: number) => {
    setCourses(courses.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý khóa học</h1>
      <p className="mb-6 text-gray-600">Quản lý thông tin các khóa học, phân công giáo viên.</p>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAdd}>
        Thêm khóa học
      </button>
      {showForm && (
        <form className="mb-6 bg-white p-4 rounded shadow flex gap-4 items-end" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Tên khóa học</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Giảng viên</label>
            <select name="teacherId" value={form.teacherId} onChange={handleChange} className="border rounded px-2 py-1">
              {teacherOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Ngày bắt đầu</label>
            <input name="startDate" value={form.startDate} onChange={handleChange} required className="border rounded px-2 py-1" type="date" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Ngày kết thúc</label>
            <input name="endDate" value={form.endDate} onChange={handleChange} required className="border rounded px-2 py-1" type="date" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input name="status" type="checkbox" checked={form.status} onChange={handleChange} />
            <label className="text-gray-700">Hoạt động</label>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={handleCancel}>Hủy</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên khóa học</th>
              <th className="px-4 py-2 border">Giảng viên</th>
              <th className="px-4 py-2 border">Ngày bắt đầu</th>
              <th className="px-4 py-2 border">Ngày kết thúc</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{course.name}</td>
                <td className="px-4 py-2 border">{teacherOptions.find(t => t.id === course.teacherId)?.name}</td>
                <td className="px-4 py-2 border">{course.startDate}</td>
                <td className="px-4 py-2 border">{course.endDate}</td>
                <td className="px-4 py-2 border">{course.status ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-500 hover:underline mr-2" onClick={() => handleEdit(idx)}>Sửa</button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDelete(idx)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement; 