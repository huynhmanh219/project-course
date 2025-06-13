// src/pages/TeacherManageStudents.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Edit, Trash2, CheckCircle, XCircle, Info, Search } from "lucide-react";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn A", mssv: "SV001", status: true, email: "nguyenvana@example.com", phone: "0123456789" },
  { id: 2, name: "Trần Thị B", mssv: "SV002", status: true, email: "tranthib@example.com", phone: "0123456788" },
  { id: 3, name: "Lê Văn C", mssv: "SV003", status: false, email: "levanc@example.com", phone: "0123456787" },
];

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
    {active ? (<><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động</>) : (<><XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa</>)}
  </span>
);

const ManageStudent: React.FC = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mssv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" /> Quản lý sinh viên lớp
            </h1>
            <p className="text-gray-500 text-base">Danh sách sinh viên trong lớp này.</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-600 transition duration-200 transform hover:scale-105"
            onClick={() => navigate('/teacher/classes/add')}
          >
            <UserPlus className="w-5 h-5" /> Thêm sinh viên
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên theo tên, MSSV hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Họ tên</th>
                  <th className="px-6 py-4 text-left font-semibold">MSSV</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Số điện thoại</th>
                  {/* <th className="px-6 py-4 text-left font-semibold">Trạng thái</th> */}
                  <th className="px-6 py-4 text-center font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      Không tìm thấy sinh viên nào.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-blue-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{s.mssv}</td>
                      <td className="px-6 py-4 text-gray-600">{s.email}</td>
                      <td className="px-6 py-4 text-gray-600">{s.phone}</td>
                      {/* <td className="px-6 py-4">{statusBadge(s.status)}</td> */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => navigate(`/teacher/classes/${s.id}/students/edit/${s.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudent;