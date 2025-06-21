import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Plus } from 'lucide-react';

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
    navigate('/admin/users');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Thêm giảng viên</h1>
            <p className="text-blue-100 text-base">Tạo mới tài khoản giảng viên cho hệ thống.</p>
          </div>
        </div>
        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Họ và tên</label>
            <input
              name="hoTen"
              value={form.hoTen}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập họ và tên đầy đủ"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="example@university.edu.vn"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Bộ môn</label>
            <select
              name="boMon"
              value={form.boMon}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            >
              {boMonOptions.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Ảnh đại diện</label>
            <input
              name="hinhAnh"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow-md"
                />
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base"
            >
              <Plus className="w-5 h-5" /> Lưu
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base"
              onClick={() => navigate('/admin/users')}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAdd; 