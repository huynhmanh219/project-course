import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const boMonOptions = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Văn' },
  { id: 3, name: 'Lý' },
];

const TeacherAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hoTen: '',
    email: '',
    boMon: boMonOptions[0].id,
    hinhAnh: '',
    trangThai: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, hinhAnh: e.target.files[0].name }); // demo: chỉ lấy tên file
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm giảng viên: ' + JSON.stringify(form, null, 2));
    navigate('/admin/teachers');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Thêm giảng viên</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Họ tên</label>
          <input name="hoTen" value={form.hoTen} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} required className="border rounded px-2 py-1 w-full" type="email" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Bộ môn</label>
          <select name="boMon" value={form.boMon} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            {boMonOptions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
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
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate('/admin/teachers')}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default TeacherAdd; 