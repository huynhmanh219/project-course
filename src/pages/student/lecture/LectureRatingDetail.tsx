import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Edit, 
  Trash2, 
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import StarRating from '../../../components/StarRating';
import { lectureRatingService, type LectureRating, type CreateRatingData } from '../../../services/lecture-rating.service';
import { authService } from '../../../services/auth.service';

const LectureRatingDetail: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [ratings, setRatings] = useState<LectureRating[]>([]);
  const [myRating, setMyRating] = useState<LectureRating | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState<LectureRating | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  
  // Stats
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [distribution, setDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  useEffect(() => {
    if (lectureId) {
      loadRatings();
      loadMyRating();
    }
  }, [lectureId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadRatings = async () => {
    try {
      setLoading(true);
      const data = await lectureRatingService.getRatingsForLecture(Number(lectureId));
      
      if (data.success) {
        setRatings(data.data.ratings || []);
        setAverageRating(data.data.averageRating || 0);
        setTotalRatings(data.data.totalRatings || 0);
        setDistribution(data.data.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    } catch (error) {
      showNotification('error', 'Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const loadMyRating = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'student') {
        return;
      }

      const data = await lectureRatingService.getMyRating(Number(lectureId));
      if (data.success && data.data.rating) {
        setMyRating(data.data.rating);
        setNewRating(data.data.rating.rating);
        setNewComment(data.data.rating.comment || '');
      }
    } catch (error) {
    }
  };

  const handleSubmitRating = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      showNotification('error', 'Vui lòng chọn số sao từ 1 đến 5');
      return;
    }

    try {
      setSubmitLoading(true);
      const ratingData: CreateRatingData = {
        rating: newRating,
        comment: newComment.trim() || undefined
      };

      let result;
      if (editingRating) {
        result = await lectureRatingService.updateRating(editingRating.id, ratingData);
        showNotification('success', 'Cập nhật đánh giá thành công!');
      } else {
        result = await lectureRatingService.createRating(Number(lectureId), ratingData);
        showNotification('success', 'Tạo đánh giá thành công!');
      }
      
      setShowRatingForm(false);
      setEditingRating(null);
      setNewComment('');
      
      await loadRatings();
      await loadMyRating();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá';
      showNotification('error', errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditRating = (rating: LectureRating) => {
    setEditingRating(rating);
    setNewRating(rating.rating);
    setNewComment(rating.comment || '');
    setShowRatingForm(true);
  };

  const handleDeleteRating = async (ratingId: number) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    
    try {
      setLoading(true);
      await lectureRatingService.deleteRating(ratingId);
      showNotification('success', 'Xóa đánh giá thành công!');
      await loadRatings();
      await loadMyRating();
      setMyRating(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startNewRating = () => {
    setEditingRating(null);
    setNewRating(5);
    setNewComment('');
    setShowRatingForm(true);
  };

  const currentUser = authService.getCurrentUser();
  const isStudent = currentUser?.role === 'student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Đánh giá bài giảng #{lectureId}
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Chia sẻ trải nghiệm học tập của bạn
                  </p>
                </div>
              </div>
              
              {isStudent && !myRating && (
                <Button 
                  onClick={startNewRating} 
                  disabled={loading}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Thêm đánh giá
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Rating Stats */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="mb-3">
                  <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-700">Điểm trung bình</h3>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating 
                  rating={averageRating} 
                  readonly 
                  size="lg"
                />
              </div>

              {/* Total Ratings */}
              <div className="text-center">
                <div className="mb-3">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-700">Tổng đánh giá</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {totalRatings}
                </div>
                <p className="text-gray-500 text-sm">lượt đánh giá</p>
              </div>

              {/* Distribution */}
              <div>
                <div className="mb-3 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-700">Phân phối</h3>
                </div>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-4">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: totalRatings > 0 ? `${(distribution[star as keyof typeof distribution] / totalRatings) * 100}%` : '0%' 
                          }}
                        />
                      </div>
                      <span className="w-6 text-right">{distribution[star as keyof typeof distribution]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Rating */}
        {isStudent && myRating && (
          <Card className="mb-6 shadow-lg border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-900">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Đánh giá của bạn</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditRating(myRating)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteRating(myRating.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StarRating rating={myRating.rating} readonly />
                {myRating.comment && (
                  <p className="text-gray-700 bg-white p-4 rounded-lg border border-blue-200">
                    {myRating.comment}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating Form */}
        {isStudent && showRatingForm && (
          <Card className="mb-6 shadow-lg border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">
                {editingRating ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Đánh giá của bạn:
                  </label>
                  <div className="flex justify-center mb-2">
                    <StarRating 
                      rating={newRating} 
                      onRatingChange={setNewRating}
                      size="lg"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {newRating === 1 && 'Rất không hài lòng'}
                    {newRating === 2 && 'Không hài lòng'}
                    {newRating === 3 && 'Bình thường'}
                    {newRating === 4 && 'Hài lòng'}
                    {newRating === 5 && 'Rất hài lòng'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét (tùy chọn):
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về bài giảng..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={4}
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newComment.length}/1000 ký tự
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSubmitRating}
                    disabled={submitLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang gửi...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {editingRating ? 'Cập nhật' : 'Gửi đánh giá'}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRatingForm(false)}
                    disabled={submitLoading}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Ratings */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Tất cả đánh giá ({ratings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải đánh giá...</p>
              </div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Chưa có đánh giá nào</h3>
                <p>Hãy là người đầu tiên đánh giá bài giảng này!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {ratings.map((rating) => (
                  <div key={rating.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                          {rating.student?.name?.[0] || 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {rating.student?.name || 'Sinh viên'}
                          </div>
                          <StarRating rating={rating.rating} readonly size="sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Vừa xong</span>
                      </div>
                    </div>
                    {rating.comment && (
                      <div className="ml-13 bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {rating.comment}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LectureRatingDetail; 