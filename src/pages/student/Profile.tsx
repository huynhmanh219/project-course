import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const mockStudent = {
  hoTen: "Nguyễn Văn Sinh Viên",
  mssv: "SV001234",
  email: "sinhvien@email.com",
  hinhAnh: "https://ui-avatars.com/api/?name=Nguyen+Van+Sinh+Vien&background=0D8ABC&color=fff",
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [hoTen, setHoTen] = useState(mockStudent.hoTen);
  const [hinhAnh, setHinhAnh] = useState(mockStudent.hinhAnh);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setHinhAnh(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // Gọi API cập nhật thông tin ở đây
    setIsEditing(false);
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Thông tin cá nhân</h1>
      <div className="flex flex-col items-center mb-6">
        <img
          src={hinhAnh}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-3"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Họ tên</label>
          {isEditing ? (
            <input
              type="text"
              value={hoTen}
              onChange={e => setHoTen(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            />
          ) : (
            <div className="text-gray-900 font-semibold">{hoTen}</div>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mã số sinh viên</label>
          <div className="text-gray-900">{mockStudent.mssv}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <div className="text-gray-900">{mockStudent.email}</div>
        </div>
      </div>
      <div className="flex gap-3 mt-8">
        {isEditing ? (
          <>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
            <Button variant="default" onClick={() => setIsEditing(false)}>Hủy</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">Chỉnh sửa</Button>
        )}
        <Button variant="default" onClick={() => navigate("/student/change-password")}>Đổi mật khẩu</Button>
      </div>
    </div>
  );
};

export default Profile; 