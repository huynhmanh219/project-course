import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Camera, Save, X, KeyRound, User, GraduationCap, Shield, Edit, Mail, MapPin, Star } from "lucide-react"
import ChangePasswordModal from "../components/ChangePasswordModal"

// Định nghĩa type cho role
type UserRole = "teacher"|"student"|"admin";

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
    khoa: "Ban Quản Trị Hệ Thống",
    chucVu: "Quản trị viên cao cấp",
  }
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  // Giả lập role, sau này lấy từ context hoặc API - đảm bảo đồng bộ với Sidebar
  const currentRole: UserRole = "admin"
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
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <GraduationCap className="w-4 h-4 mr-2" />
            Sinh viên
          </div>
        )
      case "teacher":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
            <User className="w-4 h-4 mr-2" />
            Giảng viên
          </div>
        )
      case "admin":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <Shield className="w-4 h-4 mr-2" />
            Quản trị viên
          </div>
        )
    }
  }

  const getRoleSpecificInfo = () => {
    if (currentRole === "student" as unknown as UserRole) {
      const studentData = userData as Student
      return (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-blue-700 font-bold text-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                Mã số sinh viên
              </label>
              <Star className="w-5 h-5 text-blue-500" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-mono font-bold text-lg shadow-lg">
                {studentData.mssv}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-indigo-700 font-bold text-lg">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                Lớp học
              </label>
              <Star className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-gray-900 font-bold text-xl">{studentData.lop}</div>
            </div>
          </div>
        </>
      )
    }
    
    if (currentRole === "teacher" as unknown as UserRole) {
      const teacherData = userData as Teacher
      return (
        <>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-emerald-700 font-bold text-lg">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                Mã giảng viên
              </label>
              <Star className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-mono font-bold text-lg shadow-lg">
                {teacherData.maGV}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-teal-700 font-bold text-lg">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                Chức vụ
              </label>
              <Star className="w-5 h-5 text-teal-500" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-gray-900 font-bold text-xl">{teacherData.chucVu}</div>
            </div>
          </div>
        </>
      )
    }
    
    if (currentRole === "admin" as unknown as UserRole) {
      const adminData = userData as Admin
      return (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-purple-700 font-bold text-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Mã quản trị viên
              </label>
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-mono font-bold text-lg shadow-lg">
                {adminData.maAdmin}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-pink-700 font-bold text-lg">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Chức vụ
              </label>
              <Star className="w-5 h-5 text-pink-500" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-gray-900 font-bold text-xl">{adminData.chucVu}</div>
            </div>
          </div>
        </>
      )
    }
    
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Thông tin cá nhân</h1>
              </div>
              <p className="text-blue-100 text-lg">Quản lý và cập nhật thông tin tài khoản của bạn</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center sticky top-8">
              <div className="relative inline-block mb-6">
            <div className="relative">
              <img
                src={hinhAnh}
                alt="avatar"
                    className="w-40 h-40 rounded-full object-cover ring-4 ring-blue-200 ring-offset-4 shadow-2xl mx-auto"
              />
              {isEditing && (
                <div className="absolute -bottom-2 -right-2">
                      <label className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-3 cursor-pointer shadow-xl transition-all duration-200 hover:scale-110">
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
              </div>
              
              <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{hoTen}</h2>
                {getRoleBadge(currentRole)}
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{userData.khoa}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name Card */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-gray-700 font-bold text-lg">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                Họ và tên
              </label>
                <Star className="w-5 h-5 text-gray-500" />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={hoTen}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoTen(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              ) : (
                  <div className="text-gray-900 font-bold text-xl">{hoTen}</div>
              )}
              </div>
            </div>

            {/* Role Specific Information */}
            {getRoleSpecificInfo()}

            {/* Email Card */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-orange-700 font-bold text-lg">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  Email
              </label>
                <Star className="w-5 h-5 text-orange-500" />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-gray-900 font-bold text-xl">{userData.email}</div>
              </div>
            </div>

            {/* Department Card */}
            {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-green-700 font-bold text-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  Khoa
              </label>
                <Star className="w-5 h-5 text-green-500" />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-gray-900 font-bold text-xl">{userData.khoa}</div>
            </div>
          </div> */}

          {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-wrap gap-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                      <Save className="w-5 h-5" />
                  Lưu thay đổi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                      className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg hover:bg-gray-50"
                    >
                      <X className="w-5 h-5" />
                      Hủy bỏ
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                    >
                      <Edit className="w-5 h-5" />
                      Chỉnh sửa thông tin
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                      className="flex-1 border-2 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-900 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                      <KeyRound className="w-5 h-5" />
                  Đổi mật khẩu
                </Button>
              </>
            )}
              </div>
            </div>
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
 