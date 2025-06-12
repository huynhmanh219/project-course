import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const fakeDepartment = {
  name: 'Công nghệ thông tin',
  desc: 'CNTT',
  status: true,
};

const DepartmentEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(fakeDepartment);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật bộ môn: ' + JSON.stringify(form, null, 2));
    navigate('/admin/departments');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sửa bộ môn</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Tên bộ môn</label>
          <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea name="desc" value={form.desc} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        {/* <div className="flex items-center gap-2">
          <input name="status" type="checkbox" checked={form.status} onChange={handleChange} />
          <label className="text-gray-700">Hoạt động</label>
        </div> */}
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate('/admin/departments')}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentEdit; 