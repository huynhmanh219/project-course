// src/pages/TeacherManageStudents.tsx
import React, { useState } from 'react';

const danhSachSinhVienBanDau = [
  {
    ten: 'Trần Thị B',
    mssv: 'SV001',
    email: 'b@gmail.com',
    ngayThamGia: '2024-06-01',
    trangThai: true,
  },
  {
    ten: 'Nguyễn Văn C',
    mssv: 'SV002',
    email: 'c@gmail.com',
    ngayThamGia: '2024-06-02',
    trangThai: true,
  },
  {
    ten: 'Lê Thị D',
    mssv: 'SV003',
    email: 'd@gmail.com',
    ngayThamGia: '2024-06-03',
    trangThai: false,
  },
];

const QuanLySinhVien: React.FC = () => {
  const [danhSach, setDanhSach] = useState(danhSachSinhVienBanDau);
  const [form, setForm] = useState({ ten: '', mssv: '', email: '', trangThai: true });
  const [hienForm, setHienForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleThem = () => {
    setForm({ ten: '', mssv: '', email: '', trangThai: true });
    setHienForm(true);
  };

  const handleLuu = (e: React.FormEvent) => {
    e.preventDefault();
    setDanhSach([
      ...danhSach,
      {
        ...form,
        ngayThamGia: new Date().toISOString().slice(0, 10),
      },
    ]);
    setHienForm(false);
  };

  const handleXoa = (idx: number) => {
    setDanhSach(danhSach.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý sinh viên trong lớp</h1>
      <p className="mb-6 text-gray-600">Xem, thêm, xóa sinh viên khỏi lớp học.</p>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleThem}>
        Thêm sinh viên
      </button>
      {hienForm && (
        <form className="mb-6 bg-white p-4 rounded shadow flex gap-4 items-end" onSubmit={handleLuu}>
          <div>
            <label className="block text-gray-700 mb-1">Tên sinh viên</label>
            <input name="ten" value={form.ten} onChange={handleChange} required className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">MSSV</label>
            <input name="mssv" value={form.mssv} onChange={handleChange} required className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} required className="border rounded px-2 py-1" type="email" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input name="trangThai" type="checkbox" checked={form.trangThai} onChange={handleChange} />
            <label className="text-gray-700">Hoạt động</label>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setHienForm(false)}>Hủy</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tên sinh viên</th>
              <th className="px-4 py-2 border">MSSV</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Ngày tham gia</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {danhSach.map((sv, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border">{sv.ten}</td>
                <td className="px-4 py-2 border">{sv.mssv}</td>
                <td className="px-4 py-2 border">{sv.email}</td>
                <td className="px-4 py-2 border">{sv.ngayThamGia}</td>
                <td className="px-4 py-2 border">{sv.trangThai ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</td>
                <td className="px-4 py-2 border">
                  <button className="text-red-500 hover:underline" onClick={() => handleXoa(idx)}>Xóa khỏi lớp</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuanLySinhVien;