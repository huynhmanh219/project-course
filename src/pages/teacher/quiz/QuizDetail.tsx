import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Play, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

const QuizDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/teacher/quiz')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết bài kiểm tra</h1>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Component QuizDetail đang được phát triển</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate(`/teacher/quiz/${id}/edit`)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button onClick={() => navigate(`/teacher/quiz/${id}/results`)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Xem kết quả
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizDetail; 