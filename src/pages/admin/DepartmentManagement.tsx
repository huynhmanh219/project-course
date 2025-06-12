import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialDepartments = [
  { id: 1, name: "Công nghệ thông tin", desc: "CNTT" },
  { id: 2, name: "Toán học", desc: "Bộ môn Toán" },
];

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setDepartments(departments.filter((dep) => dep.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-blue-100 p-3 rounded-full mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </span>
          <h1 className="text-2xl font-extrabold text-blue-700 text-center">Quản lý bộ môn</h1>
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-150 text-base"
            onClick={() => navigate("/admin/departments/add")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Thêm bộ môn
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 rounded-tl-2xl">Tên bộ môn</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Mô tả</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 rounded-tr-2xl">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dep, idx) => (
                <tr
                  key={dep.id}
                  className={
                    `hover:bg-blue-50 transition-colors ${idx === departments.length - 1 ? 'rounded-b-2xl' : ''}`
                  }
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{dep.name}</td>
                  <td className="px-6 py-4 text-gray-600">{dep.desc}</td>
                  <td className="px-6 py-4 text-center flex gap-2 justify-center">
                    <button
                      className="flex items-center gap-1 text-orange-700 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-2xl font-semibold shadow transition border border-orange-200 hover:shadow-md"
                      onClick={() => navigate(`/admin/departments/edit/${dep.id}`)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.213 3.75 21.25l1.037-3.75L16.862 4.487z" /></svg>
                      Sửa
                    </button>
                    <button
                      className="flex items-center gap-1 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-2 rounded-2xl font-semibold shadow transition border border-red-400 hover:shadow-md"
                      onClick={() => handleDelete(dep.id)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2m0 0h4m-4 0H7" /></svg>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
