import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
// import { Card, CardContent } from "../components/ui/card"
// import { Input } from "../components/ui/input"
// import { Label } from "../components/ui/label"
// import { Separator } from "../components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
// import { Badge } from "../components/ui/badge"
import { Camera, Save, X, KeyRound, User, GraduationCap, Shield, Edit } from "lucide-react"
import ChangePasswordModal from "../components/ChangePasswordModal"

// Định nghĩa type cho role
type UserRole = "student" | "teacher" | "admin";

// Định nghĩa interface cho từng role
interface BaseUser {
  hoTen: string;
  email: string;
  hinhAnh: string;
  role: UserRole;
  khoa: string;
}

interface Student extends BaseUser {
  mssv: string;
  lop: string;
}

interface Teacher extends BaseUser {
  maGV: string;
  chucVu: string;
}

interface Admin extends BaseUser {
  maAdmin: string;
  chucVu: string;
}

type UserData = Student | Teacher | Admin;

// Mock data cho 3 role
const mockData: Record<UserRole, UserData> = {
  student: {
    hoTen: "Nguyễn Văn Sinh Viên",
    mssv: "SV001234",
    email: "sinhvien@email.com",
    hinhAnh: "https://ui-avatars.com/api/?name=Nguyen+Van+Sinh+Vien&background=0D8ABC&color=fff",
    role: "student",
    khoa: "Công nghệ thông tin",
    lop: "CNTT1",
  },
  teacher: {
    hoTen: "Trần Thị Giảng Viên",
    maGV: "GV001234",
    email: "giangvien@email.com",
    hinhAnh: "https://ui-avatars.com/api/?name=Tran+Thi+Giang+Vien&background=0D8ABC&color=fff",
    role: "teacher",
    khoa: "Công nghệ thông tin",
    chucVu: "Giảng viên",
  },
  admin: {
    hoTen: "Lê Văn Quản Trị",
    maAdmin: "AD001234",
    email: "admin@email.com",
    hinhAnh: "https://ui-avatars.com/api/?name=Le+Van+Quan+Tri&background=0D8ABC&color=fff",
    role: "admin",
    khoa: "Công nghệ thông tin",
    chucVu: "Quản trị viên",
  }
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  // Giả lập role, sau này lấy từ context hoặc API
  const currentRole: UserRole = "student"
  const userData = mockData[currentRole]
  
  const [hoTen, setHoTen] = useState(userData.hoTen)
  const [hinhAnh, setHinhAnh] = useState(userData.hinhAnh)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setHinhAnh(ev.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSave = () => {
    // Gọi API cập nhật thông tin ở đây
    setIsEditing(false)
    alert("Cập nhật thông tin thành công!")
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "student":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <GraduationCap className="w-4 h-4 mr-1" />
            Sinh viên
          </div>
        )
      case "teacher":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            <User className="w-4 h-4 mr-1" />
            Giảng viên
          </div>
        )
      case "admin":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Shield className="w-4 h-4 mr-1" />
            Quản trị viên
          </div>
        )
    }
  }

  const getRoleSpecificInfo = () => {
    if (currentRole == "student") {
      const studentData = userData as Student
      return (
        <>
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Mã số sinh viên
            </label>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-mono font-semibold">
              {studentData.mssv}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Lớp
            </label>
            <div className="text-gray-900 font-medium text-lg">{studentData.lop}</div>
          </div>
        </>
      )
    }
    
    if (currentRole === "teacher") {
      const teacherData = userData as Teacher
      return (
        <>
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <User className="w-5 h-5 mr-2 text-emerald-600" />
              Mã giảng viên
            </label>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-mono font-semibold">
              {teacherData.maGV}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <User className="w-5 h-5 mr-2 text-emerald-600" />
              Chức vụ
            </label>
            <div className="text-gray-900 font-medium text-lg">{teacherData.chucVu}</div>
          </div>
        </>
      )
    }
    
    if (currentRole === "admin") {
      const adminData = userData as Admin
      return (
        <>
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Mã quản trị viên
            </label>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white font-mono font-semibold">
              {adminData.maAdmin}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Chức vụ
            </label>
            <div className="text-gray-900 font-medium text-lg">{adminData.chucVu}</div>
          </div>
        </>
      )
    }
    
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8" />
              Thông tin cá nhân
            </h1>
            <p className="text-blue-100 mt-2">Quản lý thông tin tài khoản của bạn</p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border-0 p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={hinhAnh}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-200 ring-offset-4 shadow-lg"
              />
              {isEditing && (
                <div className="absolute -bottom-2 -right-2">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-gray-900">{hoTen}</h2>
              {getRoleBadge(currentRole)}
            </div>
          </div>

          {/* Information Fields */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center text-gray-700 font-semibold mb-3">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={hoTen}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoTen(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              ) : (
                <div className="text-gray-900 font-medium text-lg">{hoTen}</div>
              )}
            </div>

            {getRoleSpecificInfo()}

            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center text-gray-700 font-semibold mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
              </label>
              <div className="text-gray-900 font-medium text-lg">{userData.email}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center text-gray-700 font-semibold mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Khoa
              </label>
              <div className="text-gray-900 font-medium text-lg">{userData.khoa}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Lưu thay đổi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Chỉnh sửa
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                  className="border-2 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-900 hover:bg-orange-50 font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <KeyRound className="w-5 h-5" />
                  Đổi mật khẩu
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        <ChangePasswordModal 
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  )
}

export default Profile
 