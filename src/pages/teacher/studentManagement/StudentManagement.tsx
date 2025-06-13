import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Edit, Trash2, Search, GraduationCap, UserCheck, UserX } from "lucide-react";
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

interface Student {
  id: number;
  name: string;
  mssv: string;
  class: string;
  status: boolean;
}

const initialStudents: Student[] = [
  { id: 1, name: "Nguyễn Văn A", mssv: "SV001", class: "Lớp 10A1", status: true },
  { id: 2, name: "Trần Thị B", mssv: "SV002", class: "Lớp 11B2", status: true },
  { id: 3, name: "Lê Văn C", mssv: "SV003", class: "Lớp 10A1", status: false },
  { id: 4, name: "Phạm Thị D", mssv: "SV004", class: "Lớp 11B2", status: true },
  { id: 5, name: "Hoàng Văn E", mssv: "SV005", class: "Lớp 10A1", status: false },
];

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mssv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudents = students.filter(s => s.status).length;
  const inactiveStudents = students.filter(s => !s.status).length;

  const handleDelete = (id: number) => {
    const student = students.find(s => s.id === id);
    const confirmMessage = `Bạn có chắc chắn muốn xóa sinh viên "${student?.name}" không?\n\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setStudents(students.filter(s => s.id !== id));
      alert("Đã xóa sinh viên thành công!");
    }
  };

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
       
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {student.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {student.mssv}
                  </span>
                  {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {student.status ? (
                      <>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3 mr-1" />
                        Khóa
                      </>
                    )}
                  </span> */}
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">{student.class}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teacher/students/edit/${student.id}`);
                }}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(student.id);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý sinh viên</h1>
                <p className="text-blue-100 text-lg">Quản lý thông tin sinh viên trong hệ thống</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{students.length}</div>
                  <div className="text-blue-100 text-sm">Tổng sinh viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeStudents}</div>
                  <div className="text-blue-100 text-sm">Hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveStudents}</div>
                  <div className="text-blue-100 text-sm">Khóa</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/students/add')}
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Thêm sinh viên
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? "Không tìm thấy sinh viên nào" : "Chưa có sinh viên nào"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Các sinh viên sẽ xuất hiện ở đây"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement; 