import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Edit2, ArrowLeft, Mail, Phone, Calendar, MapPin, IdCard, Loader2, AlertCircle, UserCheck, UserX } from "lucide-react";
import { authService } from "../../../services/auth.service";
import { simpleUserService } from "../../../services";
import { Button } from "../../../components/ui/button";

const TeacherStudentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    if (!studentId) {
      setError("Không tìm thấy ID sinh viên");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await simpleUserService.getStudent(parseInt(studentId));
      console.log('Student detail response:', response);
      
      const studentData = response.student || response;
      setStudent(studentData);
      
    } catch (error: any) {
      console.error('Fetch student detail error:', error);
      setError(error.message || "Lỗi khi tải thông tin sinh viên");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/teacher/students/${studentId}/edit`);
  };

  const handleBack = () => {
    navigate("/teacher/students");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin sinh viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sinh viên</h2>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const profile = student.profile || student;
  const currentUser = authService.getCurrentUser();
  const canEdit = currentUser && ['lecturer', 'admin'].includes(currentUser.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <User className="w-10 h-10 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">Chi tiết sinh viên</h1>
              <p className="text-blue-100 text-base">Thông tin chi tiết và hồ sơ sinh viên</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {student.is_active ? (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-xl">
                <UserCheck className="w-5 h-5" />
                <span className="font-medium">Hoạt động</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-xl">
                <UserX className="w-5 h-5" />
                <span className="font-medium">Không hoạt động</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <IdCard className="w-6 h-6 text-blue-600" />
                Thông tin cơ bản
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Họ và tên</label>
                    <p className="text-xl font-semibold text-gray-800 mt-1">
                      {profile.first_name} {profile.last_name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Mã số sinh viên</label>
                    <p className="text-lg font-mono font-medium text-blue-600 mt-1">
                      {profile.student_id}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-800">{student.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {profile.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Số điện thoại</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.date_of_birth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ngày sinh</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">
                          {new Date(profile.date_of_birth).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trạng thái tài khoản</label>
                    <div className="mt-1">
                      {student.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <UserCheck className="w-4 h-4" />
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          <UserX className="w-4 h-4" />
                          Không hoạt động
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {profile.address && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Địa chỉ</label>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-800 leading-relaxed">{profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Account Info & Actions */}
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin tài khoản</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">ID</label>
                  <p className="text-gray-800 mt-1">#{student.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ngày tạo</label>
                  <p className="text-gray-800 mt-1">
                    {student.created_at ? new Date(student.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Lần đăng nhập cuối</label>
                  <p className="text-gray-800 mt-1">
                    {student.last_login ? new Date(student.last_login).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={handleBack}
                  variant="default"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại danh sách
                </Button>
                
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition duration-200"
                  >
                    <Edit2 className="w-5 h-5" />
                    Chỉnh sửa thông tin
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Thống kê nhanh</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Lớp đang học:</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Điểm trung bình:</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tín chỉ tích lũy:</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
              
              <p className="text-sm text-indigo-100 mt-4">
                Thông tin học tập chi tiết đang được phát triển
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentDetail;
