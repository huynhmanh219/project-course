import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Edit, Trash2, CheckCircle, XCircle, Info } from "lucide-react";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn A", mssv: "SV001", class: "Lớp 10A1", status: true },
  { id: 2, name: "Trần Thị B", mssv: "SV002", class: "Lớp 11B2", status: true },
  { id: 3, name: "Lê Văn C", mssv: "SV003", class: "Lớp 10A1", status: false },
];

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
    {active ? (<><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động</>) : (<><XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa</>)}
  </span>
);

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState(initialStudents);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" /> Quản lý sinh viên
            </h1>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/teacher/classes/add')}
          >
            <UserPlus className="w-5 h-5" /> Thêm sinh viên
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                <th className="px-4 py-3 text-left font-semibold">Họ tên</th>
                <th className="px-4 py-3 text-left font-semibold">MSSV</th>
                {/* <th className="px-4 py-3 text-left font-semibold">Lớp</th> */}
                {/* <th className="px-4 py-3 text-left font-semibold">Trạng thái</th> */}
                <th className="px-4 py-3 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    Không có sinh viên nào.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-semibold text-blue-900">{s.name}</td>
                    <td className="px-4 py-3">{s.mssv}</td>
                    {/* <td className="px-4 py-3">{s.class}</td> */}
                    {/* <td className="px-4 py-3">{statusBadge(s.status)}</td> */}
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition duration-200"
                        onClick={() => navigate(`/teacher/classes/${s.id}/students/edit/${s.id}`)}
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                      <button 
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-rose-600 transition duration-200"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement; 