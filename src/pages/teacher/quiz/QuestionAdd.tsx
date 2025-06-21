import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

const QuestionAdd: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/teacher/quiz/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại bài kiểm tra
          </Button>
          <h1 className="text-2xl font-bold">Thêm câu hỏi mới</h1>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Component QuestionAdd đang được phát triển</p>
              <p className="text-sm text-gray-500">Form để thêm câu hỏi và đáp án cho bài kiểm tra</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionAdd; 