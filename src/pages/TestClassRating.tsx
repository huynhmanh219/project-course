import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Star, BookOpen, Users, ChevronLeft, MessageSquare, BarChart3 } from 'lucide-react';

const TestClassRating: React.FC = () => {
  const navigate = useNavigate();

  // Mock class data for testing
  const mockClasses = [
    {
      id: 1,
      section_name: "Nhập môn Lập trình - Lớp 01",
      subject: {
        subject_name: "Nhập môn Lập trình",
        subject_code: "IT101"
      },
      lecturer: {
        first_name: "Nguyễn",
        last_name: "Văn An",
        title: "ThS."
      },
      averageRating: 4.5,
      totalRatings: 28
    },
    {
      id: 2,
      section_name: "Cơ sở dữ liệu - Lớp 02",
      subject: {
        subject_name: "Cơ sở dữ liệu",
        subject_code: "IT201"
      },
      lecturer: {
        first_name: "Trần",
        last_name: "Thị Bình",
        title: "TS."
      },
      averageRating: 4.2,
      totalRatings: 35
    },
    {
      id: 3,
      section_name: "Thuật toán và Cấu trúc dữ liệu - Lớp 01",
      subject: {
        subject_name: "Thuật toán và Cấu trúc dữ liệu",
        subject_code: "IT301"
      },
      lecturer: {
        first_name: "Lê",
        last_name: "Minh Tuấn",
        title: "PGS.TS."
      },
      averageRating: 4.8,
      totalRatings: 22
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 3.0) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Xuất sắc';
    if (rating >= 4.0) return 'Tốt';
    if (rating >= 3.5) return 'Khá';
    if (rating >= 3.0) return 'Trung bình';
    return 'Cần cải thiện';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/student/classes')}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Demo Đánh giá Lớp học</h1>
            <p className="text-gray-600">Test tính năng đánh giá và phản hồi về lớp học</p>
          </div>
        </div>

        {/* Feature Info */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Hệ thống Đánh giá Lớp học</h2>
              <p className="text-purple-100 mb-3">
                Cho phép học sinh đánh giá tổng thể về lớp học, giảng viên và chất lượng giảng dạy
              </p>
              <div className="flex items-center gap-4 text-purple-100">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> Đánh giá sao
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> Nhận xét
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" /> Thống kê
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Hướng dẫn sử dụng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
              <div>
                <div className="font-semibold text-blue-800">Chọn lớp học</div>
                <div className="text-blue-600">Click vào một lớp học bên dưới để xem chi tiết và đánh giá</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
              <div>
                <div className="font-semibold text-blue-800">Đánh giá</div>
                <div className="text-blue-600">Chọn số sao và viết nhận xét về lớp học</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
              <div>
                <div className="font-semibold text-blue-800">Xem thống kê</div>
                <div className="text-blue-600">Xem đánh giá trung bình và phản hồi của các học sinh khác</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mock Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClasses.map((classData) => (
            <Card 
              key={classData.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-300"
              onClick={() => navigate(`/student/class/${classData.id}/rating`)}
            >
              <div className="space-y-4">
                {/* Class Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 leading-tight mb-1">
                      {classData.section_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {classData.subject.subject_code} - {classData.subject.subject_name}
                    </p>
                  </div>
                </div>

                {/* Lecturer */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {classData.lecturer.title} {classData.lecturer.first_name} {classData.lecturer.last_name}
                  </span>
                </div>

                {/* Rating Display */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= classData.averageRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {classData.averageRating.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getRatingColor(classData.averageRating)}`}>
                      {getRatingText(classData.averageRating)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {classData.totalRatings} đánh giá
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/class/${classData.id}/rating`);
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Đánh giá lớp học
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <Card className="p-6 bg-gray-50 border-gray-200">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lưu ý về Demo</h4>
            <p className="text-gray-600 mb-4">
              Đây là phiên bản demo với dữ liệu mẫu. Trong ứng dụng thực tế, dữ liệu sẽ được lưu trữ và đồng bộ với cơ sở dữ liệu.
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/student/classes')}
              >
                Quay lại danh sách lớp học
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/test-rating')}
              >
                Demo đánh giá bài giảng
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestClassRating; 