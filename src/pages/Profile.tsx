import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Camera, Save, X, KeyRound, User, GraduationCap, Shield, Edit, Mail, MapPin, Star, CheckCircle, AlertCircle, Phone, Calendar } from "lucide-react"
import { authService } from "../services/auth.service"

// Định nghĩa type cho role
type UserRole = "student"|"lecturer"|"admin";

// Định nghĩa interface cho từng role
interface BaseUser {
  hoTen: string;
  email: string;
  hinhAnh: string;
  role: UserRole;
  khoa: string;
  id: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

interface Student extends BaseUser {
  mssv: string;
  lop: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

interface Teacher extends BaseUser {
  maGV: string;
  chucVu: string;
  phone?: string;
  department?: string;
  bio?: string;
}

interface Admin extends BaseUser {
  maAdmin: string;
  chucVu: string;
}

type UserData = Student | Teacher | Admin;

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [hoTen, setHoTen] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [department, setDepartment] = useState('')
  const [bio, setBio] = useState('')
  const [hinhAnh, setHinhAnh] = useState('')
  
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Helper function to get proper avatar URL
  const getAvatarUrl = (profileData: any, currentUser: any): string => {
    // Priority 1: Server profile data avatar
    if (profileData?.profile?.avatar) {
      const serverAvatar = profileData.profile.avatar
      // If server avatar is already a full URL, return as-is
      if (serverAvatar.startsWith('http://') || serverAvatar.startsWith('https://') || serverAvatar.startsWith('blob:')) {
        return serverAvatar
      }
      // If server avatar is a relative path, prepend server URL
      return `http://localhost:3000${serverAvatar}?t=${Date.now()}`
    }
    
    // Priority 2: Current user avatar (from token)
    if (currentUser.profile?.avatar) {
      const userAvatar = currentUser.profile.avatar
      if (userAvatar.startsWith('http://') || userAvatar.startsWith('https://') || userAvatar.startsWith('blob:')) {
        return userAvatar
      }
      return `http://localhost:3000${userAvatar}?t=${Date.now()}`
    }
    
    // Priority 3: Check localStorage for uploaded avatar
    const savedAvatar = localStorage.getItem(`avatar_${currentUser.id}`)
    if (savedAvatar) {
      return savedAvatar
    }
    
    // Priority 4: Default avatar
    const displayName = `${currentUser.profile?.first_name || ''} ${currentUser.profile?.last_name || currentUser.email}`.trim()
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff&size=200`
  }

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError('')
      
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        navigate('/login')
        return
      }

      // Try to call actual profile API to get latest avatar
      let profileData = null
      try {
        const token = await authService.getValidToken()
        if (token) {
          const response = await fetch('http://localhost:3000/api/users/profile', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result.status === 'success') {
              profileData = result.data.user
              console.log('✅ Loaded profile from server:', profileData)
            }
          }
        }
      } catch (apiError) {
        console.log('❌ Failed to load profile from server, using mock data:', apiError)
      }

      // Create profile data (server data takes priority over mock)
      const mockProfile = createMockProfile(currentUser, profileData)
      setUserData(mockProfile)
      setHoTen(mockProfile.hoTen)
      
      // Load avatar with proper server URL handling
      const avatarUrl = getAvatarUrl(profileData, currentUser)
      setHinhAnh(avatarUrl)
      console.log('🖼️ Avatar URL set to:', avatarUrl)
      
      if (mockProfile.role === 'student') {
        const student = mockProfile as Student
        setPhone(student.phone || '')
        setAddress(student.address || '')
        setDateOfBirth(student.dateOfBirth || '')
      } else if (mockProfile.role === 'lecturer') {
        const teacher = mockProfile as Teacher
        setPhone(teacher.phone || '')
        setDepartment(teacher.department || '')
        setBio(teacher.bio || '')
      }

    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError('Không thể tải thông tin profile')
    } finally {
      setLoading(false)
    }
  }

  const createMockProfile = (currentUser: any, serverProfile?: any): UserData => {
    const baseProfile = {
      id: currentUser.id,
      hoTen: `${currentUser.profile?.first_name || 'User'} ${currentUser.profile?.last_name || 'Name'}`,
      email: currentUser.email,
      hinhAnh: '', // Will be set by getAvatarUrl
      role: currentUser.role as UserRole,
      khoa: "Công nghệ thông tin",
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    // Use server profile data if available
    if (serverProfile?.profile) {
      const profile = serverProfile.profile
      if (profile.first_name || profile.last_name) {
        baseProfile.hoTen = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      }
    }

    if (currentUser.role === 'student') {
      return {
        ...baseProfile,
        mssv: currentUser.profile?.student_id || serverProfile?.profile?.student_id || 'SV001',
        lop: "CNTT1",
        phone: serverProfile?.profile?.phone || currentUser.profile?.phone || '',
        dateOfBirth: serverProfile?.profile?.date_of_birth || currentUser.profile?.date_of_birth || '',
        address: serverProfile?.profile?.address || currentUser.profile?.address || ''
      } as Student
    } else if (currentUser.role === 'lecturer') {
      return {
        ...baseProfile,
        maGV: `GV${currentUser.id.toString().padStart(3, '0')}`,
        chucVu: serverProfile?.profile?.title || currentUser.profile?.title || "Giảng viên",
        phone: serverProfile?.profile?.phone || currentUser.profile?.phone || '',
        department: serverProfile?.profile?.department || currentUser.profile?.department || 'Công nghệ thông tin',
        bio: serverProfile?.profile?.bio || currentUser.profile?.bio || ''
      } as Teacher
    } else {
      return {
        ...baseProfile,
        maAdmin: `AD${currentUser.id.toString().padStart(3, '0')}`,
        chucVu: "Quản trị viên"
      } as Admin
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF, WEBP')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setError(`Kích thước file quá lớn (${sizeMB}MB). Tối đa 5MB`)
      return
    }

    try {
      setUploadingAvatar(true)
      setError('')

      const reader = new FileReader()
      reader.onload = (ev) => {
        setHinhAnh(ev.target?.result as string)
      }
      reader.readAsDataURL(file)

      try {
        const token = await authService.getValidToken()
        if (!token) {
          throw new Error('No authentication token')
        }

        const formData = new FormData()
        formData.append('avatar', file)

        const response = await fetch('http://localhost:3000/api/users/profile/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        const result = await response.json()
        
        if (response.ok && result.status === 'success') {
          const avatarUrl = `http://localhost:3000${result.data.avatar_url}?t=${Date.now()}`
          setHinhAnh(avatarUrl)
          
          const currentUser = authService.getCurrentUser()
          if (currentUser?.id) {
            localStorage.setItem(`avatar_${currentUser.id}`, avatarUrl)
            console.log('💾 Avatar URL saved to localStorage:', avatarUrl)
          }
          
          setSuccess('Cập nhật ảnh đại diện thành công!')
        } else {
          throw new Error(result.message || 'Upload failed')
        }
      } catch (uploadError) {
        console.log('Server upload failed, using local preview:', uploadError)
        setSuccess('Ảnh đã được cập nhật (demo mode)')
      }

      setTimeout(() => setSuccess(''), 3000)

    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      setError(error.message || 'Không thể tải lên ảnh đại diện')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')

      const updateData: any = {}
      
      const nameParts = hoTen.trim().split(' ')
      if (nameParts.length >= 2) {
        updateData.first_name = nameParts.slice(0, -1).join(' ')
        updateData.last_name = nameParts[nameParts.length - 1]
      } else {
        updateData.first_name = hoTen
        updateData.last_name = ''
      }

      if (userData?.role === 'student') {
        updateData.phone = phone
        updateData.address = address
        updateData.date_of_birth = dateOfBirth
      } else if (userData?.role === 'lecturer') {
        updateData.phone = phone
        updateData.department = department
        updateData.bio = bio
      }

      // const response = await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${authService.getToken()}`
      //   },
      //   body: JSON.stringify(updateData)
      // })

      console.log('Updating profile:', updateData)
      
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (userData) {
        setUserData(prev => prev ? { ...prev, hoTen } : null)
      }

      setSuccess('Cập nhật thông tin thành công!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)

    } catch (error: any) {
      console.error('Error saving profile:', error)
      setError('Không thể cập nhật thông tin')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setHoTen(userData.hoTen)
      setHinhAnh(userData.hinhAnh)
      
      if (userData.role === 'student') {
        const student = userData as Student
        setPhone(student.phone || '')
        setAddress(student.address || '')
        setDateOfBirth(student.dateOfBirth || '')
      } else if (userData.role === 'lecturer') {
        const teacher = userData as Teacher
        setPhone(teacher.phone || '')
        setDepartment(teacher.department || '')
        setBio(teacher.bio || '')
      }
    }
    setIsEditing(false)
    setError('')
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
      case "lecturer":
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
    if (!userData) return null

    if (userData.role === "student") {
      const studentData = userData as Student
      return (
        <>
          {/* Student ID */}
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

          {/* Phone */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-green-700 font-bold text-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Số điện thoại
              </label>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="text-gray-900 font-bold text-xl">{phone || 'Chưa cập nhật'}</div>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-purple-700 font-bold text-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Ngày sinh
              </label>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              ) : (
                <div className="text-gray-900 font-bold text-xl">
                  {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-orange-700 font-bold text-lg">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Địa chỉ
              </label>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <div className="text-gray-900 font-bold text-xl">{address || 'Chưa cập nhật'}</div>
              )}
            </div>
          </div>
        </>
      )
    }
    
    if (userData.role === "lecturer") {
      const teacherData = userData as Teacher
      return (
        <>
          {/* Teacher ID */}
          {/* <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
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
          </div> */}

          {/* Phone */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-blue-700 font-bold text-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Số điện thoại
              </label>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="text-gray-900 font-bold text-xl">{phone || 'Chưa cập nhật'}</div>
              )}
            </div>
          </div>

          {/* Department */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-purple-700 font-bold text-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Khoa/Bộ môn
              </label>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Nhập khoa/bộ môn"
                />
              ) : (
                <div className="text-gray-900 font-bold text-xl">{department || 'Chưa cập nhật'}</div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-yellow-700 font-bold text-lg">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                Tiểu sử
              </label>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all resize-none"
                  placeholder="Nhập tiểu sử"
                />
              ) : (
                <div className="text-gray-900 font-bold text-xl">{bio || 'Chưa cập nhật'}</div>
              )}
            </div>
          </div>
        </>
      )
    }
    
    if (userData.role === "admin") {
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">{error || 'Không thể tải thông tin profile'}</p>
            <Button onClick={fetchUserProfile} variant="outline" className="mt-4">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

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
                    <div className="absolute -bottom-1 -right-1">
                      <label className="bg-gradient-to-r hover:from-blue-300 hover:to-blue-400 text-white rounded-full p-2 cursor-pointer shadow-xl transition-all duration-200 hover:scale-110">
                        <Camera className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </label>
                    </div>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{hoTen}</h2>
                {getRoleBadge(userData.role)}
                
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

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-wrap gap-4">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSave} 
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                    >
                      {saving ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={saving}
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
                    {/* <Button 
                      variant="outline" 
                      onClick={() => setShowPasswordModal(true)}
                      className="flex-1 border-2 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-900 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                    >
                      <KeyRound className="w-5 h-5" />
                      Đổi mật khẩu
                    </Button> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default Profile
 
