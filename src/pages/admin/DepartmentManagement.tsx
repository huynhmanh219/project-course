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
    const department = departments.find(d => d.id === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa khoa "${department?.name}" không?\n\nHành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setDepartments(departments.filter((d) => d.id !== id));
      alert("Đã xóa khoa thành công!");
    }
  };

  const DepartmentCard: React.FC<{ department: any }> = ({ department }) => {
    return (
      <div className="group h-full">
        <div className="h-full flex flex-col shadow-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden">
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
          
          <div className="flex-1 flex flex-col p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-purple-500 to-violet-500 p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-purple-700 mb-3">{department.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">{department.desc}</p>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  className="flex-1 flex items-center justify-center gap-1 text-orange-700 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-xl font-semibold shadow transition-all duration-200 border border-orange-200 hover:shadow-md hover:-translate-y-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/departments/edit/${department.id}`);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.213 3.75 21.25l1.037-3.75L16.862 4.487z" /></svg>
                  Sửa
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-2 rounded-xl font-semibold shadow transition-all duration-200 border border-red-400 hover:shadow-md hover:-translate-y-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(department.id);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2m0 0h4m-4 0H7" /></svg>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý Lớp</h1>
                <p className="text-blue-100 text-lg">Quản lý thông tin các lớp.</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{departments.length}</div>
                  <div className="text-blue-100 text-sm">Tổng lớp</div>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex items-center gap-2"
                  onClick={() => navigate("/admin/departments/add")}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Thêm bộ môn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>

        {/* Empty State */}
        {departments.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có bộ môn nào
              </h3>
              <p className="text-gray-500">
                Các bộ môn sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
