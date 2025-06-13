import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { X, KeyRound, Eye, EyeOff, Lock, Shield, CheckCircle } from "lucide-react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) errors.push("Ít nhất 8 ký tự")
    if (!/[A-Z]/.test(password)) errors.push("Có chữ hoa")
    if (!/[a-z]/.test(password)) errors.push("Có chữ thường")
    if (!/\d/.test(password)) errors.push("Có số")
    return errors
  }

  const handleChangePassword = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
    }
    
    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
    } else {
      const passwordErrors = validatePassword(newPassword)
      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Mật khẩu phải: ${passwordErrors.join(", ")}`
      }
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      // Gọi API đổi mật khẩu ở đây
      onClose()
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setErrors({})
      alert("Đổi mật khẩu thành công!")
    }
  }

  const handleClose = () => {
    onClose()
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-8 py-6 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Đổi mật khẩu</h3>
                <p className="text-red-100 text-sm">Cập nhật mật khẩu để bảo mật tài khoản</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-700 font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              Mật khẩu hiện tại
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`pr-12 border-2 rounded-xl py-3 bg-gray-50 hover:bg-white transition-colors ${
                  errors.currentPassword ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                }`}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.currentPassword}
              </p>
            )}
          </div>
          
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`pr-12 border-2 rounded-xl py-3 bg-gray-50 hover:bg-white transition-colors ${
                  errors.newPassword ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.newPassword}
              </p>
            )}
            {newPassword && !errors.newPassword && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <CheckCircle className="w-4 h-4" />
                  Mật khẩu mạnh
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Đủ 8 ký tự
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Có chữ hoa
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Có chữ thường
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Có số
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Xác nhận mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pr-12 border-2 rounded-xl py-3 bg-gray-50 hover:bg-white transition-colors ${
                  errors.confirmPassword ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-green-500"
                }`}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Mật khẩu khớp nhau
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
              <Shield className="w-4 h-4" />
              Yêu cầu mật khẩu
            </div>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Tối thiểu 8 ký tự</li>
              <li>• Có ít nhất 1 chữ hoa (A-Z)</li>
              <li>• Có ít nhất 1 chữ thường (a-z)</li>
              <li>• Có ít nhất 1 số (0-9)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="flex gap-4">
            <Button
              variant="default"
              onClick={handleClose}
              className=" flex-1 border-2 border-gray-300  text-blue-300 font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleChangePassword}
              className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <KeyRound className="w-5 h-5 mr-2" />
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal 