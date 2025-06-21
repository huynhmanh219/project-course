import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/student/quiz')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
          <h1 className="text-2xl font-bold">Kết quả bài kiểm tra</h1>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kết quả bài kiểm tra</h3>
              <p className="text-gray-600 mb-4">Component QuizResult đang được phát triển</p>
              <p className="text-sm text-gray-500">Sẽ hiển thị điểm số, phân tích chi tiết và so sánh kết quả</p>
              
              <div className="mt-8 flex gap-4 justify-center">
                <Button onClick={() => navigate('/student/quiz')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Làm bài khác
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/student/quiz/history')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Xem lịch sử
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResult; 