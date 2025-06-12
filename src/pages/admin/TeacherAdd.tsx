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
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, hinhAnh: e.target.files[0].name });
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm giảng viên: ' + JSON.stringify(form, null, 2));
    navigate('/admin/teachers');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-blue-100 p-3 rounded-full mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
          </span>
          <h1 className="text-2xl font-extrabold text-blue-700 text-center">Thêm giảng viên</h1>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Họ tên <span className="text-red-500">*</span></label>
            <input name="hoTen" value={form.hoTen} onChange={handleChange} required className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nhập họ tên" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email <span className="text-red-500">*</span></label>
            <input name="email" value={form.email} onChange={handleChange} required className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="email" placeholder="Nhập email" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Bộ môn</label>
            <select name="boMon" value={form.boMon} onChange={handleChange} className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
              {boMonOptions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ảnh đại diện</label>
            <input name="hinhAnh" type="file" accept="image/*" onChange={handleImageChange} className="border border-blue-200 rounded-lg px-3 py-2 w-full" />
            {preview && (
              <div className="mt-2 flex justify-center">
                <img src={preview} alt="avatar preview" className="w-20 h-20 rounded-full object-cover border border-blue-200" />
              </div>
            )}
          </div>
          {/* <div className="flex items-center gap-2">
            <input name="trangThai" type="checkbox" checked={form.trangThai} onChange={handleChange} />
            <label className="text-gray-700">Hoạt động</label>
          </div> */}
          <div className="flex gap-3 justify-end mt-2">
            <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition">Lưu</button>
            <button type="button" className="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" onClick={() => navigate('/admin/users')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAdd; 