import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Check, Search, GraduationCap, Mail, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleCourseService, simpleUserService } from '../../../services';

interface Student {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  profile: {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    avatar?: string;
  };
}

interface ClassInfo {
  id: number;
  section_name: string;
  max_students: number;
  subject: {
    subject_name: string;
    subject_code: string;
  };
  lecturer: {
    first_name: string;
    last_name: string;
  };
}

const StudentAddToClass: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEnrollmentCount, setCurrentEnrollmentCount] = useState(0);
  const navigate = useNavigate();

  const loadData = async () => {
    if (!classId) {
      setError('Không tìm thấy ID lớp học');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const classResponse = await simpleCourseService.getClass(Number(classId));
      
      if (classResponse.class) {
        setClassInfo(classResponse.class);
      }

      const currentStudentsResponse = await simpleCourseService.getClassStudents(Number(classId));
      
      if (currentStudentsResponse.students) {
        setCurrentEnrollmentCount(currentStudentsResponse.students.length);
      }

      const studentsResponse = await simpleUserService.getStudents();
      
      if (studentsResponse.students) {
        const enrolledStudentIds = currentStudentsResponse.students?.map((s: any) => s.account.id) || [];
        const availableStudents = studentsResponse.students.filter(
          (student: Student) => !enrolledStudentIds.includes(student.id) && student.is_active
        );
        setStudents(availableStudents);
      } else {
        setError('Không thể tải danh sách sinh viên');
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  const toggleStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    const filteredStudentIds = filteredStudents
      .slice(0, maxSelectable)
      .map(student => student.id);
    setSelectedStudents(filteredStudentIds);
  };

  const clearAll = () => {
    setSelectedStudents([]);
  };

  const handleEnroll = async () => {
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một sinh viên để thêm vào lớp');
      return;
    }

    const confirmMessage = `Bạn có chắc chắn muốn thêm ${selectedStudents.length} sinh viên vào lớp "${classInfo?.section_name}" không?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setEnrolling(true);
        
        const studentProfileIds = selectedStudents.map(accountId => {
          const student = students.find(s => s.id === accountId);
          return student?.profile.id;
        }).filter(id => id !== undefined);

        const response = await simpleCourseService.enrollStudents(Number(classId), studentProfileIds);
        
        if (response.results) {
          const { successful, failed } = response.results;
          
          let message = '';
          if (successful.length > 0) {
            message += `Đã thêm thành công ${successful.length} sinh viên vào lớp.\n`;
          }
          if (failed.length > 0) {
            message += `${failed.length} sinh viên không thể thêm vào lớp:\n`;
            failed.forEach((failure: any) => {
              message += `- ${failure.error}\n`;
            });
          }
          
          alert(message);
          
          if (successful.length > 0) {
            navigate(`/teacher/classes/${classId}/students`);
          }
        } else {
          alert('Đã thêm sinh viên vào lớp thành công!');
          navigate(`/teacher/classes/${classId}/students`);
        }
      } catch (error: any) {
        console.error('Enrollment error:', error);
        alert(`Lỗi khi thêm sinh viên: ${error.message}`);
      } finally {
        setEnrolling(false);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    if (!searchTerm.trim()) return true;
    const fullName = `${student.profile?.first_name || ''} ${student.profile?.last_name || ''}`.toLowerCase();
    const studentId = student.profile?.student_id?.toLowerCase() || '';
    const email = student.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || studentId.includes(search) || email.includes(search);
  });

  const remainingCapacity = classInfo ? classInfo.max_students - currentEnrollmentCount : 0;
  const maxSelectable = Math.min(remainingCapacity, filteredStudents.length);

  const StudentCard: React.FC<{ student: Student; isSelected: boolean; onToggle: () => void }> = ({ 
    student, 
    isSelected, 
    onToggle 
  }) => {
    const fullName = student.profile ? `${student.profile.first_name} ${student.profile.last_name}` : 'Chưa cập nhật tên';
    const studentId = student.profile?.student_id || 'N/A';
    
    return (
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' 
            : 'border-gray-200 hover:shadow-lg hover:border-blue-200'
        }`}
        onClick={onToggle}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg p-2 flex-shrink-0 ${
              isSelected ? 'bg-blue-500' : 'bg-gradient-to-tr from-blue-500 to-indigo-500'
            }`}>
              {isSelected ? (
                <Check className="text-white w-5 h-5" />
              ) : (
                <User className="text-white w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                {fullName}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {studentId}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Mail className="w-3 h-3" />
                <span className="truncate">{student.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  Thêm sinh viên vào lớp
                </h1>
                {classInfo && (
                  <div className="space-y-2 text-blue-100">
                    <p className="text-lg">
                      <strong>{classInfo.subject.subject_code}</strong> - {classInfo.subject.subject_name}
                    </p>
                    <p>Lớp: {classInfo.section_name}</p>
                    <p>Giảng viên: {classInfo.lecturer.first_name} {classInfo.lecturer.last_name}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentEnrollmentCount}</div>
                  <div className="text-blue-100 text-sm">Đã ghi danh</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{remainingCapacity}</div>
                  <div className="text-blue-100 text-sm">Còn trống</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedStudents.length}</div>
                  <div className="text-blue-100 text-sm">Đã chọn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={loadData} 
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-800"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Capacity Warning */}
        {remainingCapacity <= 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-700">
              Lớp học đã đầy. Không thể thêm sinh viên mới.
            </p>
          </div>
        )}

        {/* Search and Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sinh viên theo tên, MSSV hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={selectAll}
                disabled={maxSelectable <= 0 || filteredStudents.length === 0}
                className="px-4 py-3"
              >
                Chọn tất cả ({Math.min(maxSelectable, filteredStudents.length)})
              </Button>
              <Button
                variant="default"
                onClick={clearAll}
                disabled={selectedStudents.length === 0}
                className="px-4 py-3"
              >
                Bỏ chọn tất cả
              </Button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isSelected={selectedStudents.includes(student.id)}
              onToggle={() => {
                if (!selectedStudents.includes(student.id) && selectedStudents.length >= maxSelectable) {
                  alert(`Chỉ có thể chọn tối đa ${maxSelectable} sinh viên (dựa trên sỉ số còn trống của lớp)`);
                  return;
                }
                toggleStudent(student.id);
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có sinh viên khả dụng</h3>
              <p className="text-gray-500">Tất cả sinh viên đã được thêm vào lớp này</p>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading && students.length > 0 && filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sinh viên nào</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-700">
                  Đã chọn {selectedStudents.length} sinh viên
                </span>
              </div>
              {remainingCapacity > 0 && (
                <span className="text-sm text-gray-500">
                  (Còn có thể chọn {Math.max(0, maxSelectable - selectedStudents.length)} sinh viên)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => navigate(`/teacher/classes/${classId}/students`)}
                className="px-6 py-3"
              >
                Hủy
              </Button>
              <Button
                onClick={handleEnroll}
                disabled={selectedStudents.length === 0 || enrolling}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm sinh viên ({selectedStudents.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAddToClass; 