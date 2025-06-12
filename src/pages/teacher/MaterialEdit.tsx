import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const loaiTaiLieuOptions = [
  "PDF", "DOC", "PPT", "VIDEO", "AUDIO", "HINH_ANH", "KHAC"
];

// Dữ liệu mẫu
const fakeMaterial = {
  tenTaiLieu: "Bài giảng 1",
  moTa: "Tài liệu PDF chương 1",
  loaiTaiLieu: "PDF",
  duongDanFile: "bai-giang-1.pdf",
  trangThai: true,
};

const MaterialEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(fakeMaterial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, duongDanFile: e.target.files[0].name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã cập nhật tài liệu: " + JSON.stringify(form, null, 2));
    navigate('/teacher/materials');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sửa tài liệu</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Tên tài liệu</label>
          <input name="tenTaiLieu" value={form.tenTaiLieu} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea name="moTa" value={form.moTa} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Loại tài liệu</label>
          <select name="loaiTaiLieu" value={form.loaiTaiLieu} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            {loaiTaiLieuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Đường dẫn file</label>
          <input name="duongDanFile" type="file" onChange={handleFileChange} className="border rounded px-2 py-1 w-full" />
          {form.duongDanFile && <div className="mt-2 text-sm text-gray-500">Đã chọn: {form.duongDanFile}</div>}
        </div>
        {/* <div className="flex items-center gap-2">
          <input name="trangThai" type="checkbox" checked={form.trangThai} onChange={handleChange} />
          <label className="text-gray-700">Hoạt động</label>
        </div> */}
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate('/teacher/materials')}>Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default MaterialEdit; 