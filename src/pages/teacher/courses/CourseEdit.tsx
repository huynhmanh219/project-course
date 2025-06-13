import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Edit2, Layers, FileText, X } from "lucide-react";

const giangVienOptions = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];
const chuongOptions = [
  { id: 1, name: "Chương 1: Số học" },
  { id: 2, name: "Chương 2: Đại số" },
  { id: 3, name: "Chương 3: Hình học" },
];
const taiLieuOptions = [
  { id: 1, name: "Tài liệu chương 1.pdf" },
  { id: 2, name: "Slide bài giảng.pptx" },
  { id: 3, name: "Video bài giảng.mp4" },
];

const fakeCourse = {
  maMonHoc: "MATH10",
  tenMonHoc: "Toán 10",
  moTa: "Khóa học Toán nâng cao",
  giangVienId: 1,
  ngayTao: "2024-06-01",
  trangThai: true,
  chuong: [1, 2],
  taiLieu: [1],
};

const CourseEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(fakeCourse);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "chuong" || name === "taiLieu") {
      const select = e.target as HTMLSelectElement;
      const selected = Array.from(select.selectedOptions).map((o) => Number(o.value));
      setForm({ ...form, [name]: selected });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleRemove = (name: "chuong" | "taiLieu", id: number) => {
    setForm({ ...form, [name]: form[name].filter((v) => v !== id) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã cập nhật khoá học: " + JSON.stringify(form, null, 2));
    navigate("/teacher/courses");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center gap-4 text-white">
          <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Sửa môn học</h1>
            <p className="text-blue-100 text-base">Cập nhật thông tin môn học.</p>
          </div>
        </div>
        <form className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6" onSubmit={handleSubmit}>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tên môn học</label>
            <input
              name="tenMonHoc"
              value={form.tenMonHoc}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập tên môn học"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Mô tả</label>
            <textarea
              name="moTa"
              value={form.moTa}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              placeholder="Nhập mô tả môn học"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Giảng viên phụ trách</label>
            <select
              name="giangVienId"
              value={form.giangVienId}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            >
              {giangVienOptions.map((gv) => (
                <option key={gv.id} value={gv.id}>{gv.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Ngày tạo</label>
            <input
              name="ngayTao"
              value={form.ngayTao}
              onChange={handleChange}
              type="date"
              className="border rounded-xl px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              name="trangThai"
              type="checkbox"
              checked={form.trangThai}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <label className="text-gray-700 font-semibold">Hoạt động</label>
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
              onClick={() => navigate("/teacher/courses")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEdit; 