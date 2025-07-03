import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Download, Users, Clock, Target,
  TrendingUp, AlertCircle, Award
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { simpleQuizService } from '../../../services/quiz.service.simple';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  student_id?: string;
}

interface QuizResult {
  id: number;
  student: Student;
  score: string;
  max_score: string;
  percentage: string;
  time_spent?: number;
  started_at: string;
  submitted_at?: string;
  status: string;
  attempt_number: number;
}

interface QuizInfo {
  id: number;
  title: string;
  total_questions: number;
  total_points: number;
}

const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    if (id) {
      loadQuizResults();
    }
  }, [id]);

  const loadQuizResults = async () => {
    try {
      setLoading(true);
      setError('');

      // Load quiz details and results
      const [quizResponse, resultsResponse] = await Promise.all([
        simpleQuizService.getQuiz(parseInt(id!)),
        simpleQuizService.getQuizResults(parseInt(id!))
      ]);

      console.log('Quiz Response:', quizResponse);
      console.log('Results Response:', resultsResponse);

      // simpleQuizService already unwraps the .data property (if present),
      // so quizResponse IS the quiz object, not { data: quiz }
      const quizData: any = (quizResponse && (quizResponse.data || quizResponse)) || null;
      if (quizData) {
        setQuiz({
          id: quizData.id,
          title: quizData.title,
          total_questions: quizData.total_questions || quizData.questions?.length || 0,
          total_points: quizData.total_points || quizData.max_score || 10
        });
      }

      // Results response comes back as { data: paginatedResults, statistics: stats }
      // where paginatedResults has a .data array. Adjust accordingly.
      if (resultsResponse) {
        const paginated = resultsResponse.data || resultsResponse;
        const resultsArray = Array.isArray(paginated.data) ? paginated.data : paginated;
        if (Array.isArray(resultsArray)) {
          setResults(resultsArray);
        }
      }

    } catch (error: any) {
      console.error('Error loading quiz results:', error);
      setError('Không thể tải kết quả bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: string) => {
    const score = parseFloat(percentage);
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (startTime: string, endTime?: string) => {
    if (!endTime) return '0:00';
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const seconds = Math.floor((end - start) / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateStatistics = () => {
    const completedResults = results.filter(r => r.status === 'submitted');
    const totalAttempts = completedResults.length;
    
    if (totalAttempts === 0) {
      return {
        totalAttempts: 0,
        averageScore: '0.0',
        passRate: '0.0',
        averagePercentage: '0.0'
      };
    }

    const scores = completedResults.map(r => parseFloat(r.score));
    const percentages = completedResults.map(r => parseFloat(r.percentage));
    
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalAttempts;
    const averagePercentage = percentages.reduce((a, b) => a + b, 0) / totalAttempts;
    const passRate = (completedResults.filter(r => parseFloat(r.percentage) >= 60).length / totalAttempts) * 100;

    return {
      totalAttempts,
      averageScore: averageScore.toFixed(1),
      passRate: passRate.toFixed(1),
      averagePercentage: averagePercentage.toFixed(1)
    };
  };

  const filteredResults = results
    .filter(result => {
      const studentName = `${result.student?.first_name || ''} ${result.student?.last_name || ''}`.trim();
      return studentName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return parseFloat(b.score || '0') - parseFloat(a.score || '0');
        case 'time':
          const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() - new Date(a.started_at).getTime() : 0;
          const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() - new Date(b.started_at).getTime() : 0;
          return aTime - bTime;
        case 'name':
          const nameA = `${a.student?.first_name || ''} ${a.student?.last_name || ''}`.trim();
          const nameB = `${b.student?.first_name || ''} ${b.student?.last_name || ''}`.trim();
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

  const stats = calculateStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải kết quả</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/teacher/quiz')} className="w-full">
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/teacher/quiz')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Kết quả bài kiểm tra</h1>
              <p className="text-gray-600">{quiz?.title || 'Đang tải...'}</p>
            </div>
          </div>
          <Button onClick={() => console.log('Export results')}>
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số lượt làm</p>
                  <p className="text-xl font-bold">{stats.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Điểm TB</p>
                  <p className="text-xl font-bold">{stats.averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ đạt</p>
                  <p className="text-xl font-bold">{stats.passRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng câu hỏi</p>
                  <p className="text-xl font-bold">{quiz?.total_questions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Điểm TB (%)</p>
                  <p className="text-xl font-bold">{stats.averagePercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Tìm kiếm theo tên sinh viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="score">Sắp xếp theo điểm</option>
                  <option value="time">Sắp xếp theo thời gian</option>
                  <option value="name">Sắp xếp theo tên</option>
                </select>
              </div>
              <p className="text-gray-600">
                Hiển thị {filteredResults.length} kết quả
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sinh viên</th>
                    <th className="text-center py-3 px-4">Lần thử</th>
                    <th className="text-center py-3 px-4">Điểm số</th>
                    <th className="text-center py-3 px-4">Thời gian</th>
                    <th className="text-center py-3 px-4">Thời điểm nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {result.student?.first_name} {result.student?.last_name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {result.attempt_number}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={getScoreColor(result.percentage)}>
                          {result.score}/{result.max_score} ({result.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {formatTime(result.started_at, result.submitted_at)}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {result.submitted_at ? new Date(result.submitted_at).toLocaleString('vi-VN') : 'Chưa nộp'}
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        Chưa có kết quả nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults; 