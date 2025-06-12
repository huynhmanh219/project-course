import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { User, Edit, Trash2, Plus } from "lucide-react";

const initialStudents = [
  {
    id: 1,
    mssv: "SV001234",
    hoTen: "Nguyễn Văn A",
    email: "a@student.edu",
    hinhAnh: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff",
    ngayThem: "2024-06-01",
    trangThai: true,
  },
  {
    id: 2,
    mssv: "SV001235",
    hoTen: "Trần Thị B",
    email: "b@student.edu",
    hinhAnh: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=0D8ABC&color=fff",
    ngayThem: "2024-06-02",
    trangThai: true,
  },
];

const emptyStudent = {
  id: 0,
  mssv: "",
  hoTen: "",
  email: "",
  hinhAnh: "",
  ngayThem: "",
  trangThai: true,
};

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState(initialStudents);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<typeof emptyStudent | null>(null);
  const [form, setForm] = useState(emptyStudent);

  const handleOpenAdd = () => {
    setForm({ ...emptyStudent, id: students.length + 1, ngayThem: new Date().toISOString().slice(0, 10) });
    setEditStudent(null);
    setShowForm(true);
  };
  const handleOpenEdit = (student: typeof emptyStudent) => {
    setForm(student);
    setEditStudent(student);
    setShowForm(true);
  };
  const handleDelete = (id: number) => {
    if (window.confirm("Bạn chắc chắn muốn xoá sinh viên này?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({ ...prev, hinhAnh: ev.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStudent) {
      setStudents(students.map(s => (s.id === form.id ? form : s)));
    } else {
      setStudents([...students, form]);
    }
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Quản lý sinh viên</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sinh viên
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">MSSV</th>
              <th className="px-4 py-2 border">Họ tên</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Ảnh</th>
              <th className="px-4 py-2 border">Ngày thêm</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              {/* <th className="px-4 py-2 border">Hành động</th> */}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">Chưa có sinh viên nào.</td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id} className="text-center">
                  <td className="px-4 py-2 border">{s.id}</td>
                  <td className="px-4 py-2 border font-semibold">{s.mssv}</td>
                  <td className="px-4 py-2 border">{s.hoTen}</td>
                  <td className="px-4 py-2 border">{s.email}</td>
                  <td className="px-4 py-2 border"><img src={s.hinhAnh} alt="avatar" className="w-10 h-10 rounded-full mx-auto" /></td>
                  <td className="px-4 py-2 border">{s.ngayThem}</td>
                  {/* <td className="px-4 py-2 border">{s.trangThai ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khoá</span>}</td> */}
                  <td className="px-4 py-2 border flex gap-2 justify-center">
                    <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-white" onClick={() => handleOpenEdit(s)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowForm(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">{editStudent ? "Sửa sinh viên" : "Thêm sinh viên"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">MSSV</label>
                <input type="text" name="mssv" value={form.mssv} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Họ tên</label>
                <input type="text" name="hoTen" value={form.hoTen} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Ảnh đại diện</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                {form.hinhAnh && <img src={form.hinhAnh} alt="avatar" className="w-14 h-14 rounded-full mt-2" />}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Trạng thái</label>
                <select name="trangThai" value={form.trangThai ? "true" : "false"} onChange={e => setForm(f => ({ ...f, trangThai: e.target.value === "true" }))} className="w-full border rounded px-3 py-2">
                  <option value="true">Hoạt động</option>
                  <option value="false">Khoá</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Lưu</Button>
                <Button type="button" variant="default" onClick={() => setShowForm(false)}>Huỷ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement; 