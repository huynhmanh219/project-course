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
  Award
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import StarRating from '../../../components/StarRating';
import { lectureRatingService, type LectureRating, type CreateRatingData } from '../../../services/lecture-rating.service';
import { authService } from '../../../services/auth.service';

const LectureRatingPage: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<LectureRating[]>([]);
  const [myRating, setMyRating] = useState<LectureRating | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState<LectureRating | null>(null);
  
  // Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  
  // Stats
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    if (lectureId) {
      loadRatings();
      loadMyRating();
    }
  }, [lectureId]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const data = await lectureRatingService.getRatingsForLecture(Number(lectureId));
      
      if (data.success) {
        setRatings(data.data.ratings || []);
        setAverageRating(data.data.averageRating || 0);
        setTotalRatings(data.data.totalRatings || 0);
      } else {
        setRatings(data.ratings || []);
        
        if (data.ratings && data.ratings.length > 0) {
          const total = data.ratings.length;
          const avg = data.ratings.reduce((sum: number, r: LectureRating) => sum + r.rating, 0) / total;
          setAverageRating(avg);
          setTotalRatings(total);
        }
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
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
      } else if (data.rating) {
        setMyRating(data.rating);
        setNewRating(data.rating.rating);
        setNewComment(data.rating.comment || '');
      }
    } catch (error) {
    }
  };

  const handleSubmitRating = async () => {
    try {
      setLoading(true);
      const ratingData: CreateRatingData = {
        rating: newRating,
        comment: newComment.trim() || undefined
      };

      if (editingRating) {
        await lectureRatingService.updateRating(editingRating.id, ratingData);
      } else {
        await lectureRatingService.createRating(Number(lectureId), ratingData);
      }
      
      // Reset form
      setShowRatingForm(false);
      setEditingRating(null);
      setNewComment('');
      
      // Reload data
      await loadRatings();
      await loadMyRating();
    } catch (error) {
    } finally {
      setLoading(false);
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
      await loadRatings();
      await loadMyRating();
      setMyRating(null);
    } catch (error) {
      console.error('Error deleting rating:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Đánh giá bài giảng
            </h1>
            
            {!myRating && (
              <Button onClick={startNewRating} disabled={loading}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Thêm đánh giá
              </Button>
            )}
          </div>
        </div>

        {/* Rating Stats */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Điểm trung bình:</span>
                </div>
                <StarRating 
                  rating={averageRating} 
                  readonly 
                  showCount 
                  totalRatings={totalRatings}
                  size="lg"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{totalRatings} đánh giá</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Rating */}
        {myRating && (
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Đánh giá của bạn</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditRating(myRating)}
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
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {myRating.comment}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating Form */}
        {showRatingForm && (
          <Card className="mb-6 border-green-200">
            <CardHeader>
              <CardTitle>
                {editingRating ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá của bạn:
                  </label>
                  <StarRating 
                    rating={newRating} 
                    onRatingChange={setNewRating}
                    size="lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét (tùy chọn):
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về bài giảng..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSubmitRating}
                    disabled={loading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {editingRating ? 'Cập nhật' : 'Gửi đánh giá'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRatingForm(false)}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tất cả đánh giá ({ratings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải...</p>
              </div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có đánh giá nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {rating.student?.name?.[0] || 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {rating.student?.name || 'Sinh viên'}
                          </div>
                          <StarRating rating={rating.rating} readonly size="sm" />
                        </div>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700 ml-11 bg-gray-50 p-3 rounded-lg">
                        {rating.comment}
                      </p>
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

export default LectureRatingPage; 