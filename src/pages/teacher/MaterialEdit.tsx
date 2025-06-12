import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Edit2 } from "lucide-react";

const typeOptions = [
  { value: "PDF", label: "PDF" },
  { value: "PPT", label: "PPT" },
  { value: "VIDEO", label: "VIDEO" },
];

const fakeMaterial = {
  name: "Tài liệu HTML.pdf",
  type: "PDF",
  file: "Tài liệu HTML.pdf",
};

const MaterialEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(fakeMaterial);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã cập nhật tài liệu: " + JSON.stringify(form, null, 2));
    navigate("/teacher/materials");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <FileText className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa tài liệu</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin tài liệu cho khoá học.</p>
          </div>
        </div>
        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tên tài liệu</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập tên tài liệu"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Loại tài liệu</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            >
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Đường dẫn file</label>
            <input
              name="file"
              value={form.file}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập đường dẫn file hoặc upload"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base"
            >
              <Edit2 className="w-5 h-5" /> Lưu
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base"
              onClick={() => navigate("/teacher/materials")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialEdit; 