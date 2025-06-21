import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

const QuestionEdit: React.FC = () => {
  const navigate = useNavigate();
  const { quizId, questionId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/teacher/quiz/${quizId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại bài kiểm tra
          </Button>
          <h1 className="text-2xl font-bold">Chỉnh sửa câu hỏi</h1>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Component QuestionEdit đang được phát triển</p>
              <p className="text-sm text-gray-500">Form để chỉnh sửa câu hỏi và đáp án</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionEdit; 