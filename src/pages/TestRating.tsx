import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, PlayCircle, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const TestRating: React.FC = () => {
  const navigate = useNavigate();

  // Sample lectures for testing
  const sampleLectures = [
    {
      id: 1,
      title: "Giới thiệu về HTML",
      description: "Học cách tạo cấu trúc trang web với HTML",
      duration: "45 phút",
      courseTitle: "Lập trình Web"
    },
    {
      id: 2,
      title: "CSS cơ bản",
      description: "Tạo giao diện đẹp với CSS",
      duration: "60 phút",
      courseTitle: "Lập trình Web"
    },
    {
      id: 3,
      title: "JavaScript cơ bản",
      description: "Lập trình JavaScript từ cơ bản đến nâng cao",
      duration: "90 phút",
      courseTitle: "Lập trình Web"
    },
    {
      id: 4,
      title: "Giải tích 1",
      description: "Giới hạn, đạo hàm và ứng dụng",
      duration: "120 phút",
      courseTitle: "Toán Cao Cấp"
    },
    {
      id: 5,
      title: "Ma trận và định thức",
      description: "Đại số tuyến tính cơ bản",
      duration: "100 phút",
      courseTitle: "Toán Cao Cấp"
    }
  ];

  const LectureCard: React.FC<{ lecture: any }> = ({ lecture }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlayCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {lecture.title}
                </CardTitle>
                <p className="text-sm text-blue-600 font-medium">
                  {lecture.courseTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-gray-200 text-gray-200" />
              <Star className="w-4 h-4 fill-gray-200 text-gray-200" />
              <span className="text-sm text-gray-600 ml-1">(2)</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 mb-4 text-sm">
            {lecture.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>{lecture.duration}</span>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate(`/student/lecture/${lecture.id}/rating`)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Star className="w-4 h-4 mr-1" />
              Đánh giá
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Hệ thống Đánh giá Bài giảng
          </h1>
          <p className="text-gray-600">
            Click vào nút "Đánh giá" để test chức năng rating
          </p>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleLectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Hướng dẫn Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-blue-800">
              <p>1. Click nút "Đánh giá" trên bất kỳ bài giảng nào</p>
              <p>2. Thử tạo đánh giá mới (chọn sao và viết comment)</p>
              <p>3. Thử chỉnh sửa đánh giá đã tạo</p>
              <p>4. Thử xóa đánh giá</p>
              <p>5. Xem các đánh giá của sinh viên khác</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestRating; 