import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Camera, Save, X, KeyRound, User } from "lucide-react"
import ChangePasswordModal from "../../components/ChangePasswordModal"

const mockStudent = {
  hoTen: "Nguyễn Văn Sinh Viên",
  mssv: "SV001234",
  email: "sinhvien@email.com",
  hinhAnh: "https://ui-avatars.com/api/?name=Nguyen+Van+Sinh+Vien&background=0D8ABC&color=fff",
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [hoTen, setHoTen] = useState(mockStudent.hoTen)
  const [hinhAnh, setHinhAnh] = useState(mockStudent.hinhAnh)
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
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
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Sinh viên
              </div>
            </div>
          </div>

          {/* Information Fields */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center text-gray-700 font-semibold mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
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

            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center text-gray-700 font-semibold mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Mã số sinh viên
              </label>
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-mono font-semibold">
                {mockStudent.mssv}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center text-gray-700 font-semibold mb-3">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
              </label>
              <div className="text-gray-900 font-medium text-lg">{mockStudent.email}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lưu thay đổi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Chỉnh sửa
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                  className="border-2 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-900 hover:bg-orange-50 font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
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
 