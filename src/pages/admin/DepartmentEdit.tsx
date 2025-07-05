import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const fakeDepartment = {
  name: 'Công nghệ thông tin',
  desc: 'CNTT',
  status: true,
};

const DepartmentEdit: React.FC = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-yellow-100 p-3 rounded-full mb-2">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.213 3.75 21.25l1.037-3.75L16.862 4.487z" /></svg>
          </span>
          <h1 className="text-2xl font-extrabold text-yellow-600 text-center">Sửa khoa</h1>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tên khoa <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} required className="border border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Nhập tên khoa" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
            <textarea name="desc" value={form.desc} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Nhập mô tả (tuỳ chọn)" />
          </div>
          {/* <div className="flex items-center gap-2">
            <input name="status" type="checkbox" checked={form.status} onChange={handleChange} />
            <label className="text-gray-700">Hoạt động</label>
          </div> */}
          <div className="flex gap-3 justify-end mt-2">
            <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition">Lưu</button>
            <button type="button" className="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-500 transition" onClick={() => navigate('/admin/departments')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentEdit; 