import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Users, Target, TrendingUp, Clock, Award, BarChart3, CheckCircle, XCircle 
} from 'lucide-react';

interface QuizStatistics {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTimeSpent: number;
  passRate: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
}

interface Props {
  statistics: QuizStatistics | null;
  quiz: any;
}

const QuizResultsOverview: React.FC<Props> = ({ statistics, quiz }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{statistics.totalAttempts}</div>
                <div className="text-sm text-gray-600">Tổng lượt làm bài</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{statistics.averageScore.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Điểm trung bình</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{statistics.passRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Tỷ lệ đạt</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatTime(statistics.averageTimeSpent)}</div>
                <div className="text-sm text-gray-600">Thời gian TB</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Phân bố điểm</h3>
          <div className="space-y-3">
            {Object.entries(statistics.gradeDistribution).map(([grade, count]) => {
              const total = statistics.completedAttempts || 1;
              const percentage = (count / total) * 100;
              const colorClass = {
                A: 'bg-green-500',
                B: 'bg-blue-500',
                C: 'bg-yellow-500',
                D: 'bg-orange-500',
                F: 'bg-red-500'
              }[grade] || 'bg-gray-500';
              
              return (
                <div key={grade} className="flex items-center gap-4">
                  <div className="w-8 text-center font-semibold">{grade}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className={`${colorClass} h-6 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-sm">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Score Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Điểm cao nhất</div>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.highestScore.toFixed(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Điểm trung bình</div>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.averageScore.toFixed(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-sm text-gray-600">Điểm thấp nhất</div>
                <div className="text-2xl font-bold text-red-600">
                  {statistics.lowestScore.toFixed(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Info */}
      {quiz && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin bài kiểm tra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tiêu đề</p>
                <p className="font-medium">{quiz.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Thời gian làm bài</p>
                <p className="font-medium">{quiz.duration || quiz.time_limit} phút</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng số câu hỏi</p>
                <p className="font-medium">{quiz.question_count || quiz.total_questions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng điểm</p>
                <p className="font-medium">{quiz.max_score || quiz.total_marks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizResultsOverview; 