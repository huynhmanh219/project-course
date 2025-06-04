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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý bộ môn</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate("/admin/departments/add")}
      >
        Thêm bộ môn
      </button>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center">Tên bộ môn</th>
            <th className="px-4 py-2 border text-center">Mô tả</th>
            <th className="px-4 py-2 border text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep.id}>
              <td className="px-4 py-2 border text-center">{dep.name}</td>
              <td className="px-4 py-2 border text-center">{dep.desc}</td>
              <td className="px-4 py-2 border text-center">
                <button
                  className="text-blue-600 mr-2"
                  onClick={() => navigate(`/admin/departments/edit/${dep.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(dep.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentManagement;
