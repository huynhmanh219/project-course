import React, { useState } from "react";

const initialRoles = [
  {
    id: 1,
    name: "Quản trị",
    desc: "Quản lý toàn bộ hệ thống",
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
    ),
  },
  {
    id: 2,
    name: "Giảng viên",
    desc: "Quản lý lớp, khóa học",
    icon: (
      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
    ),
  },
  {
    id: 3,
    name: "Sinh viên",
    desc: "Học tập, tham gia lớp",
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4 0-7 1.5-7 3.5V20h14v-2.5c0-2-3-3.5-7-3.5z" /><circle cx="12" cy="8" r="4" /></svg>
    ),
  },
];

const RoleManagement: React.FC = () => {
  const [roles] = useState(initialRoles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow">Thông tin Vai Trò</h1>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 rounded-tl-2xl">Vai trò</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">Mô tả</th>
                {/* <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 rounded-tr-2xl">Hành động</th> */}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr
                  key={role.id}
                  className={
                    `hover:bg-blue-50 transition-colors ${idx === roles.length - 1 ? 'rounded-b-2xl' : ''}`
                  }
                >
                  <td className="px-6 py-4 flex items-center gap-3 font-medium text-gray-800">
                    {role.icon}
                    <span>{role.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{role.desc}</td>
                  {/* <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 mr-2" disabled>Sửa</button>
                    <button className="text-red-600" disabled>Xóa</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
