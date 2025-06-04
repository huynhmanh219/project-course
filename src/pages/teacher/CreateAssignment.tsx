import React, { useState } from 'react';

const moduleOptions = [
  { id: 1, name: 'Chương 1: Đại số' },
  { id: 2, name: 'Chương 2: Hình học' },
];

const CreateAssignment: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    moduleId: moduleOptions[0].id,
    dueDate: '',
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
    alert('Đã tạo bài tập: ' + JSON.stringify(form, null, 2));
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Tạo bài tập mới</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Tên bài tập</label>
          <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Học phần</label>
          <select name="moduleId" value={form.moduleId} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            {moduleOptions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Hạn nộp</label>
          <input name="dueDate" value={form.dueDate} onChange={handleChange} required className="border rounded px-2 py-1 w-full" type="date" />
        </div>
        <div className="flex items-center gap-2">
          <input name="status" type="checkbox" checked={form.status} onChange={handleChange} />
          <label className="text-gray-700">Hoạt động</label>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
      </form>
    </div>
  );
};

export default CreateAssignment; 