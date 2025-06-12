import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Giả lập dữ liệu khóa học, thực tế sẽ lấy từ API
const courseOptions = [
  { id: 1, name: "Toán 10" },
  { id: 2, name: "Văn 11" },
];

const ClassAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenLop: "",
    khoaHocId: courseOptions[0].id,
    moTa: "",
    trangThai: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API thêm lớp học ở đây
    alert("Đã thêm lớp học: " + JSON.stringify(form, null, 2));
    navigate("/teacher/my-classes");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Thêm lớp học</h1>
      <form className="bg-white p-6 rounded shadow flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Tên lớp</label>
          <input
            name="tenLop"
            value={form.tenLop}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Khóa học</label>
          <select
            name="khoaHocId"
            value={form.khoaHocId}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            {courseOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="moTa"
            value={form.moTa}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <input
            name="trangThai"
            type="checkbox"
            checked={form.trangThai}
            onChange={handleChange}
          />
          <label className="text-gray-700">Hoạt động</label>
        </div> */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Lưu
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => navigate("/teacher/my-classes")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassAdd; 