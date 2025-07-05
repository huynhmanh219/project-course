import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import StarRating from '../../components/StarRating';
import { 
  Star, 
  MessageSquare, 
  ChevronLeft, 
  Save, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users
} from 'lucide-react';
import { classRatingService, type ClassRating, type ClassRatingStats } from '../../services/class-rating.service';
import { simpleClassService } from '../../services';

interface ClassInfo {
  id: number;
  section_name: string;
  subject: {
    subject_name: string;
    subject_code: string;
  };
  lecturer: {
    first_name: string;
    last_name: string;
    title: string;
  };
}

const ClassRatingPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const classIdNum = parseInt(classId || '0');

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [myRating, setMyRating] = useState<ClassRating | null>(null);
  const [ratingStats, setRatingStats] = useState<ClassRatingStats | null>(null);
  const [allRatings, setAllRatings] = useState<ClassRating[]>([]);
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, [classIdNum]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load class info
      const classResponse = await simpleClassService.getClass(classIdNum);
      if (classResponse?.class) {
        setClassInfo(classResponse.class);
      }

      // Load real data from API
      try {
        // Load my rating
        const myRatingResponse = await classRatingService.getStudentClassRating(classIdNum);
        setMyRating(myRatingResponse);
        
        if (myRatingResponse) {
          setFormData({
            rating: myRatingResponse.rating,
            comment: myRatingResponse.comment || ''
          });
        }
      } catch (error: any) {
        console.log('No existing rating found or error:', error.message);
        setMyRating(null);
      }

      try {
        // Load rating stats
        const statsResponse = await classRatingService.getClassRatingStats(classIdNum);
        setRatingStats(statsResponse);
      } catch (error: any) {
        console.error('Error loading rating stats:', error);
        // Set default stats if no ratings exist
        setRatingStats({
          averageRating: 0,
          totalRatings: 0,
          ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }

      try {
        // Load all ratings for this class
        const ratingsResponse = await classRatingService.getClassRatings(classIdNum);
        console.log('Ratings response:', ratingsResponse);
        setAllRatings((ratingsResponse as any).data?.ratings || (ratingsResponse as any).ratings || []);
      } catch (error: any) {
        console.error('Error loading all ratings:', error);
        setAllRatings([]);
      }
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn số sao đánh giá' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      if (myRating) {
        // Update existing rating
        const updatedRating = await classRatingService.updateClassRating(myRating.id, {
          rating: formData.rating,
          comment: formData.comment
        });
        setMyRating(updatedRating);
        setMessage({ type: 'success', text: 'Cập nhật đánh giá thành công!' });
        
        // Update in all ratings list
        setAllRatings(prev => prev.map(r => r.id === updatedRating.id ? updatedRating : r));
      } else {
        // Create new rating
        const newRating = await classRatingService.createClassRating({
          class_id: classIdNum,
          rating: formData.rating,
          comment: formData.comment
        });
        setMyRating(newRating);
        setMessage({ type: 'success', text: 'Đánh giá đã được gửi thành công!' });
        
        // Add to all ratings list
        setAllRatings(prev => [newRating, ...prev]);
      }
      
      // Reload stats to reflect changes
      const statsResponse = await classRatingService.getClassRatingStats(classIdNum);
      setRatingStats(statsResponse);
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myRating || !confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    try {
      setSubmitting(true);
      setMessage(null);

      await classRatingService.deleteClassRating(myRating.id);
      
      setMyRating(null);
      setFormData({ rating: 0, comment: '' });
      setMessage({ type: 'success', text: 'Đã xóa đánh giá thành công!' });
      
      // Remove from all ratings
      setAllRatings(prev => prev.filter(r => r.id !== myRating.id));
      
      // Reload stats to reflect changes
      const statsResponse = await classRatingService.getClassRatingStats(classIdNum);
      setRatingStats(statsResponse);
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingBreakdownPercentage = (count: number) => {
    if (!ratingStats || parseInt(ratingStats.totalRatings.toString()) === 0) return 0;
    return (count / parseInt(ratingStats.totalRatings.toString())) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="bg-gray-200 rounded-3xl h-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="outline"
            onClick={() => navigate('/student/classes')}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </Button>
          
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy lớp học</h2>
            <p className="text-gray-600">Lớp học không tồn tại hoặc bạn không có quyền truy cập.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/student/classes/${classIdNum}`)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại lớp học
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Đánh giá lớp học</h1>
            <p className="text-gray-600">{classInfo.section_name}</p>
          </div>
        </div>

        {/* Class Info Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{classInfo.section_name}</h2>
              <p className="text-blue-100 mb-2">{classInfo.subject.subject_name} - {classInfo.subject.subject_code}</p>
              <p className="text-blue-200 text-sm">
                Giảng viên: {classInfo.lecturer.title} {classInfo.lecturer.first_name} {classInfo.lecturer.last_name}
              </p>
            </div>
            {ratingStats && parseInt(ratingStats.totalRatings.toString()) > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold">{parseFloat(ratingStats.averageRating.toString()).toFixed(1)}</div>
                <StarRating rating={parseFloat(ratingStats.averageRating.toString())} readonly size="md" />
                <div className="text-blue-200 text-sm mt-1">{parseInt(ratingStats.totalRatings.toString())} đánh giá</div>
              </div>
            )}
          </div>
        </Card>

        {/* Message */}
        {message && (
          <Card className={`p-4 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </span>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Form */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {myRating ? 'Chỉnh sửa đánh giá của bạn' : 'Đánh giá lớp học này'}
                </h3>
                <p className="text-sm text-gray-600">
                  Chia sẻ trải nghiệm học tập của bạn
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Đánh giá tổng thể *
                </Label>
                <div className="flex items-center gap-4">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) => setFormData({ ...formData, rating })}
                    size="lg"
                  />
                  <span className="text-sm text-gray-600">
                    {formData.rating > 0 ? `${formData.rating}/5 sao` : 'Chưa đánh giá'}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="comment" className="text-sm font-medium mb-3 block">
                  Nhận xét (không bắt buộc)
                </Label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Chia sẻ những điều bạn thích hoặc gợi ý cải thiện về lớp học này..."
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.comment.length}/500 ký tự
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submitting ? 'Đang xử lý...' : myRating ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                </Button>
                
                {myRating && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Rating Statistics */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Thống kê đánh giá</h3>
                <p className="text-sm text-gray-600">
                  Tổng quan về đánh giá từ học sinh
                </p>
              </div>
            </div>

            {ratingStats && parseInt(ratingStats.totalRatings.toString()) > 0 ? (
              <div className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {parseFloat(ratingStats.averageRating.toString()).toFixed(1)}
                  </div>
                  <StarRating rating={parseFloat(ratingStats.averageRating.toString())} readonly size="lg" />
                  <div className="text-gray-600 mt-2">
                    Dựa trên {parseInt(ratingStats.totalRatings.toString())} đánh giá
                  </div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm w-8">{stars} ⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${getRatingBreakdownPercentage(ratingStats.ratingBreakdown[stars as keyof typeof ratingStats.ratingBreakdown])}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {ratingStats.ratingBreakdown[stars as keyof typeof ratingStats.ratingBreakdown]}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full mt-4"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {showAllReviews ? 'Ẩn tất cả đánh giá' : 'Xem tất cả đánh giá'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">Chưa có đánh giá nào</h4>
                <p className="text-gray-500">Hãy là người đầu tiên đánh giá lớp học này!</p>
              </div>
            )}
          </Card>
        </div>

        {/* All Reviews */}
        {showAllReviews && allRatings.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Tất cả đánh giá ({allRatings.length})
            </h3>
            
            <div className="space-y-4">
              {allRatings.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {rating.student?.first_name?.charAt(0)}{rating.student?.last_name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">
                          {rating.student?.first_name} {rating.student?.last_name}
                        </span>
                        <StarRating rating={rating.rating} readonly size="sm" />
                        <span className="text-xs text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {rating.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClassRatingPage; 