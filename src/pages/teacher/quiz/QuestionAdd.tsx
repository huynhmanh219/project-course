import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, HelpCircle, FileText, Hash } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleQuizService } from '../../../services/quiz.service.simple';
import { PermissionUtils } from '../../../utils/permissions';

const QuestionAdd: React.FC = () => {
  const navigate = useNavigate();
  const { id: quizId } = useParams();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    points: '1',
    explanation: '',
    is_required: true,
    answers: [
      { answer_text: '', is_correct: false },
      { answer_text: '', is_correct: false },
      { answer_text: '', is_correct: false },
      { answer_text: '', is_correct: false }
    ]
  });

  useEffect(() => {
    if (quizId) {
      loadQuizInfo();
    }
  }, [quizId]);

  const loadQuizInfo = async () => {
    try {
      const quizData = await simpleQuizService.getQuiz(parseInt(quizId!));
      
      const permissionCheck = PermissionUtils.canManageQuestions(quizData);
      if (!permissionCheck.canManage) {
        PermissionUtils.redirectIfNoPermission(false, permissionCheck.reason, `/teacher/quiz/${quizId}`);
        return;
      }
      
      setQuiz(quizData);
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAnswerChange = (index: number, field: 'answer_text' | 'is_correct', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) => {
        if (field === 'is_correct' && value === true) {
          return { ...answer, is_correct: i === index };
        } else if (field === 'answer_text' && i === index) {
          return { ...answer, [field]: value as string };
        }
        return answer;
      })
    }));
  };

  const addAnswer = () => {
    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers, { answer_text: '', is_correct: false }]
    }));
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length > 2) {
      setFormData(prev => ({
        ...prev,
        answers: prev.answers.filter((_, i) => i !== index)
      }));
    }
  };

  const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      question_type: type,
      answers: type === 'true_false' 
        ? [
            { answer_text: 'Đúng', is_correct: false },
            { answer_text: 'Sai', is_correct: false }
          ]
        : type === 'multiple_choice'
        ? [
            { answer_text: '', is_correct: false },
            { answer_text: '', is_correct: false },
            { answer_text: '', is_correct: false },
            { answer_text: '', is_correct: false }
          ]
        : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.question_text.trim()) {
        alert('Vui lòng nhập nội dung câu hỏi');
        return;
      }

      if (formData.question_type === 'multiple_choice' || formData.question_type === 'true_false') {
        const validAnswers = formData.answers.filter(ans => ans.answer_text.trim());
        if (validAnswers.length < 2) {
          alert('Cần ít nhất 2 đáp án');
          return;
        }
        
        const correctAnswers = validAnswers.filter(ans => ans.is_correct);
        if (correctAnswers.length === 0) {
          alert('Cần chọn đáp án đúng');
          return;
        }
        
        if (formData.question_type === 'multiple_choice' && correctAnswers.length > 1) {
          alert('Chỉ được chọn 1 đáp án đúng cho câu hỏi trắc nghiệm');
          return;
        }
      }

      const questionData = {
        quiz_id: parseInt(quizId!),
        question_text: formData.question_text.trim(),
        question_type: formData.question_type,
        points: parseFloat(formData.points),
        explanation: formData.explanation.trim(),
        is_required: formData.is_required,
        answers: (formData.question_type === 'multiple_choice' || formData.question_type === 'true_false') 
          ? formData.answers
              .filter(ans => ans.answer_text.trim())
              .map((ans, index) => ({
                answer_text: ans.answer_text.trim(),
                is_correct: ans.is_correct,
                order_index: index + 1
              }))
          : []
      };

      const response = await simpleQuizService.createQuestion(questionData);
      
      alert('Thêm câu hỏi thành công!');
      navigate(`/teacher/quiz/${quizId}`);
      
    } catch (error: any) {
      console.error('Error creating question:', error);
      alert('Lỗi tạo câu hỏi: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const renderAnswerInputs = () => {
    if (formData.question_type === 'short_answer' || formData.question_type === 'essay') {
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Đáp án {formData.question_type === 'true_false' ? '(Đúng/Sai)' : ''}
          </label>
          {formData.question_type === 'multiple_choice' && (
            <Button
              type="button"
              onClick={addAnswer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm đáp án
            </Button>
          )}
        </div>
        
        {formData.answers.map((answer, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded min-w-[28px] text-center">
                {String.fromCharCode(65 + index)}
              </span>
              <input
                type={formData.question_type === 'multiple_choice' ? 'radio' : 'checkbox'}
                name={formData.question_type === 'multiple_choice' ? 'correct_answer' : undefined}
                checked={answer.is_correct}
                onChange={(e) => handleAnswerChange(index, 'is_correct', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
            </div>
            <input
              type="text"
              value={answer.answer_text}
              onChange={(e) => handleAnswerChange(index, 'answer_text', e.target.value)}
              placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly={formData.question_type === 'true_false'}
            />
            {formData.question_type === 'multiple_choice' && formData.answers.length > 2 && (
              <Button
                type="button"
                onClick={() => removeAnswer(index)}
                className="bg-red-500 hover:bg-red-600 text-white p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        
        <p className="text-xs text-gray-500">
          {formData.question_type === 'multiple_choice' 
            ? '⚪ Chọn 1 đáp án đúng (radio button)'
            : '✓ Tick vào ô để đánh dấu đáp án đúng'
          }
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
          <Button
                variant="secondary"
                onClick={() => navigate(`/teacher/quiz/${quizId}`)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 p-3"
          >
                <ArrowLeft className="w-5 h-5" />
          </Button>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Thêm câu hỏi mới</h1>
                  <p className="text-blue-100 text-lg mt-1">
                    {quiz ? `Bài kiểm tra: ${quiz.title}` : 'Đang tải...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Loại câu hỏi <span className="text-red-500">*</span>
                </label>
                <select
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleQuestionTypeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                >
                  <option value="multiple_choice">Trắc nghiệm nhiều lựa chọn</option>
                  {/* <option value="true_false">Đúng/Sai</option>
                  <option value="short_answer">Trả lời ngắn</option>
                  <option value="essay">Tự luận</option> */}
                </select>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Nội dung câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung câu hỏi..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                  required
                />
              </div>

              {/* Points */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-indigo-500" />
                  Điểm số <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                  required
                />
              </div>

              {/* Answers */}
              {renderAnswerInputs()}

              {/* Explanation */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Giải thích (tùy chọn)
                </label>
                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  placeholder="Giải thích cho câu hỏi..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 text-base transition-all duration-200"
                  onClick={() => navigate(`/teacher/quiz/${quizId}`)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg text-base transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Thêm câu hỏi
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-blue-800">
              <HelpCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Lưu ý:</p>
                <ul className="text-sm mt-1 space-y-1">
                  <li>• Trắc nghiệm: Chỉ được chọn 1 đáp án đúng trong 4 đáp án A, B, C, D</li>
                  <li>• Đúng/Sai: Chọn đáp án đúng bằng cách tick vào ô</li>
                  <li>• Tự luận: Sẽ cần chấm điểm thủ công</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionAdd; 