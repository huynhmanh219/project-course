import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { BookOpen, User2, Info, CheckCircle, XCircle, GraduationCap, AlertCircle } from "lucide-react";
import { simpleClassService } from "../../services";

interface ClassData {
  id: number;
  courseSection: {
    id: number;
    section_name: string;
    max_students: number;
    start_date: string;
    end_date: string;
    status: string;
    subject: {
      id: number;
      subject_name: string;
      subject_code: string;
      credits: number;
      description?: string;
    };
    lecturer: {
      id: number;
      first_name: string;
      last_name: string;
      title: string;
    };
  };
  enrollment_date: string;
  status: string;
}

const StudentClasses: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await simpleClassService.getMyStudentClasses();
        console.log('Student classes response:', response);
        
        if (response && response.data) {
          setClasses(response.data);
        } else {
          setClasses([]);
        }
      } catch (error: any) {
        console.error('Error fetching student classes:', error);
        setError(error.message || 'Không thể tải danh sách lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const ClassCard: React.FC<{ cls: ClassData }> = ({ cls }) => {
    const isActive = cls.status === 'enrolled' && cls.courseSection.status === 'active';
    
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/student/classes/${cls.courseSection.id}`)}
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {cls.courseSection.section_name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đang học
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        {cls.status === 'completed' ? 'Đã hoàn thành' : 'Tạm dừng'}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Class Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium">
                  {cls.courseSection.lecturer.title} {cls.courseSection.lecturer.first_name} {cls.courseSection.lecturer.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>{cls.courseSection.subject.subject_name}</span>
                <span className="text-gray-400">({cls.courseSection.subject.credits} tín chỉ)</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {cls.courseSection.subject.description || `Môn học ${cls.courseSection.subject.subject_name} - ${cls.courseSection.subject.subject_code}`}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/student/classes/${cls.courseSection.id}`);
                }}
                disabled={!isActive}
              >
                {isActive ? "Vào lớp" : "Lớp không khả dụng"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl shadow-lg animate-pulse">
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-2xl p-8 text-white">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold">Có lỗi xảy ra</h1>
                <p className="text-red-100">{error}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeCount = classes.filter(cls => cls.status === 'enrolled' && cls.courseSection.status === 'active').length;
  const inactiveCount = classes.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Danh sách lớp học</h1>
                <p className="text-blue-100 text-lg">Khám phá và theo dõi tiến độ học tập của bạn</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <div className="text-blue-100 text-sm">Đang học</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveCount}</div>
                  <div className="text-blue-100 text-sm">Không hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <div className="text-blue-100 text-sm">Tổng số lớp</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có lớp học nào
              </h3>
              <p className="text-gray-500">
                Bạn chưa đăng ký lớp học nào. Liên hệ giáo vụ để đăng ký các lớp học.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClasses; 