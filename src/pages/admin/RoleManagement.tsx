import React, { useState } from "react";

const initialRoles = [
  { id: 1, name: "Quản trị", desc: "Quản lý toàn bộ hệ thống" },
  { id: 2, name: "Giảng viên", desc: "Quản lý lớp, khóa học" },
  { id: 3, name: "Sinh viên", desc: "Học tập, tham gia lớp" },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState(initialRoles);

  const handleDelete = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý vai trò</h1>
      {/* <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Thêm vai trò
      </button> */}
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên vai trò</th>
            <th className="px-4 py-2 border text-center">Mô tả</th>
            {/* <th className="text-center">Hành động</th> */}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="px-4 py-2 border text-center">{role.name}</td>
              <td className="px-4 py-2 border text-center">{role.desc}</td>
              {/* <td className="text-center">
                <button className="text-blue-600 mr-2">Sửa</button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(role.id)}
                >
                  Xóa
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
