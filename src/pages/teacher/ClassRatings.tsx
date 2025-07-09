import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import StarRating  from '../../components/StarRating';
import { classRatingService } from '../../services/class-rating.service';
import { Search, Eye, TrendingUp, Users, BookOpen, MessageSquare } from 'lucide-react';
import { apiClient } from '../../services/api';

interface ClassRating {
  id: number;
  class_id: number;
  rating: number;
  comment: string;
  created_at: string;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    account: {
      email: string;
    };
  };
}

interface MyClassInfo {
  id: number;
  section_name: string;
  subject: {
    id: number;
    subject_name: string;
    subject_code: string;
    credits: number;
  };
  lecturer: {
    id: number;
    first_name: string;
    last_name: string;
    title: string;
  };
  enrollmentCount?: number;
}

interface MyClassRatingData {
  class_info: MyClassInfo;
  ratings: ClassRating[];
  statistics: {
    averageRating: number;
    totalRatings: number;
    distribution: { [key: string]: number };
  };
}

const TeacherClassRatings: React.FC = () => {
  const [myClassRatings, setMyClassRatings] = useState<MyClassRatingData[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<MyClassRatingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<MyClassRatingData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Thống kê tổng quan
  const [overallStats, setOverallStats] = useState({
    totalClasses: 0,
    totalRatings: 0,
    averageRating: 0,
    classesWithRatings: 0
  });

  useEffect(() => {
    fetchMyClassRatings();
  }, []);

  useEffect(() => {
    filterRatings();
  }, [searchTerm, ratingFilter, myClassRatings]);

  const fetchMyClassRatings = async () => {
    try {
      setLoading(true);
      // Lấy profile để có lecturer_id
      const profileData = await apiClient.get('/users/profile');
      
      let lecturerId = null;
      if (profileData.status === 'success' && profileData.data.user.role === 'lecturer') {
        // lecturer_id nằm trong profile object
        lecturerId = profileData.data.user.profile?.id;
      }
      
      // Lấy danh sách lớp học của giảng viên
      const classesUrl = lecturerId ? `/courses/classes?lecturer_id=${lecturerId}&limit=100` : '/courses/classes?limit=100';
      const classesData = await apiClient.get(classesUrl);
      
      if (classesData.status === 'success') {
        const classRatingsPromises = classesData.data.classes.map(async (classInfo: MyClassInfo) => {
          try {
            const ratingsResponse = await classRatingService.getClassRatings(classInfo.id);
            const raw: any = ratingsResponse.data.statistics || {};
            const stats = {
              averageRating: parseFloat(raw.averageRating ?? raw.average_rating ?? 0),
              totalRatings: raw.totalRatings ?? raw.total_ratings ?? 0,
              distribution: raw.distribution ?? {}
            };
            return {
              class_info: classInfo,
              ratings: ratingsResponse.data.ratings || [],
              statistics: stats
            };
          } catch (error) {
            return {
              class_info: classInfo,
              ratings: [],
              statistics: {
                averageRating: 0,
                totalRatings: 0,
                distribution: {}
              }
            };
          }
        });

        const classRatingsData = await Promise.all(classRatingsPromises);
        setMyClassRatings(classRatingsData);
        
        // Tính thống kê tổng quan
        const totalClasses = classRatingsData.length;
        const classesWithRatings = classRatingsData.filter(item => item.statistics.totalRatings > 0).length;
        const totalRatings = classRatingsData.reduce((sum, item) => sum + item.statistics.totalRatings, 0);
        const averageRating = totalRatings > 0 
          ? classRatingsData.reduce((sum, item) => sum + (item.statistics.averageRating * item.statistics.totalRatings), 0) / totalRatings
          : 0;
        
        setOverallStats({
          totalClasses,
          totalRatings,
          averageRating,
          classesWithRatings
        });
      }
    } catch (error) {
      console.error('Error fetching my class ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRatings = () => {
    let filtered = myClassRatings;

    // Lọc theo tên lớp học/môn học
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.class_info.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class_info.subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class_info.subject.subject_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo rating
    if (ratingFilter !== 'all') {
      if (ratingFilter === 'no-rating') {
        filtered = filtered.filter(item => item.statistics.totalRatings === 0);
      } else {
        const minRating = parseInt(ratingFilter);
        filtered = filtered.filter(item => 
          item.statistics.totalRatings > 0 &&
          item.statistics.averageRating >= minRating && 
          item.statistics.averageRating < minRating + 1
        );
      }
    }

    setFilteredRatings(filtered);
  };

  const handleViewDetails = (classData: MyClassRatingData) => {
    setSelectedClass(classData);
    setShowDetails(true);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Xuất sắc';
    if (rating >= 3.5) return 'Tốt';
    if (rating >= 2.5) return 'Trung bình';
    return 'Cần cải thiện';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đánh giá lớp học của tôi</h1>
        <p className="text-gray-600">Xem đánh giá từ sinh viên về các lớp học bạn đang giảng dạy</p>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lớp học</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{isNaN(overallStats.totalRatings) ? 0 : overallStats.totalRatings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Điểm TB</p>
                <p className={`text-2xl font-bold ${getRatingColor(overallStats.averageRating)}`}>
                  {Number(overallStats.averageRating).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lớp có đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.classesWithRatings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên lớp, môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-48 font-semibold">
                <SelectValue placeholder="Lọc theo rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" ><Button variant="outline" className="w-full">Tất cả</Button></SelectItem>
                <SelectItem value="4">4-5 sao</SelectItem>
                <SelectItem value="3">3-4 sao</SelectItem>
                <SelectItem value="2">2-3 sao</SelectItem>
                <SelectItem value="1">1-2 sao</SelectItem>
                <SelectItem value="no-rating">Chưa có đánh giá</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách lớp học dạng bảng */}
      {filteredRatings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Lớp học</th>
                <th className="py-3 px-4 text-left">Môn học</th>
                <th className="py-3 px-4 text-center">Điểm TB</th>
                <th className="py-3 px-4 text-center">Số đánh giá</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatings.map((item) => (
                <tr key={item.class_info.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.class_info.section_name}</td>
                  <td className="py-3 px-4 text-gray-700">{item.class_info.subject.subject_name}</td>
                  <td className="py-3 px-4 text-center">
                    <StarRating rating={Number(item.statistics.averageRating)} readonly size="sm" />
                    <span className="ml-1 font-semibold">{Number(item.statistics.averageRating).toFixed(1)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">{item.statistics.totalRatings}</td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                      disabled={item.statistics.totalRatings === 0}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy lớp học nào phù hợp với bộ lọc</p>
          </CardContent>
        </Card>
      )}

      {/* Modal chi tiết */}
      {showDetails && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Chi tiết đánh giá - {selectedClass.class_info.section_name}
                </h2>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Đóng
                </Button>
              </div>

              {/* Thông tin lớp học */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Thông tin lớp học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tên lớp:</p>
                      <p className="font-medium">{selectedClass.class_info.section_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Môn học:</p>
                      <p className="font-medium">{selectedClass.class_info.subject.subject_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mã môn:</p>
                      <p className="font-medium">{selectedClass.class_info.subject.subject_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Đánh giá:</p>
                      <p className={`font-medium ${getRatingColor(Number(selectedClass.statistics.averageRating))}`}>
                        {getRatingLabel(Number(selectedClass.statistics.averageRating))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thống kê chi tiết */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Thống kê đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className={`text-3xl font-bold ${getRatingColor(Number(selectedClass.statistics.averageRating))}`}>
                        {Number(selectedClass.statistics.averageRating).toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Điểm trung bình</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {selectedClass.statistics.totalRatings}
                      </p>
                      <p className="text-sm text-gray-600">Tổng đánh giá</p>
                    </div>
                    <div className="text-center">
                      <StarRating rating={Number(selectedClass.statistics.averageRating)} readonly />
                      <p className={`text-sm font-medium mt-1 ${getRatingColor(Number(selectedClass.statistics.averageRating))}`}>
                        {getRatingLabel(Number(selectedClass.statistics.averageRating))}
                      </p>
                    </div>
                  </div>

                  {/* Phân bố rating */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = selectedClass.statistics.distribution[star] || 0;
                      const percent = selectedClass.statistics.totalRatings > 0 ? (count / Number(selectedClass.statistics.totalRatings)) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center">
                          <span className="w-12 text-sm">{star} sao</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                            <div
                              className="bg-yellow-400 h-3 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="w-12 text-sm text-right">
                            {count} ({percent.toFixed(1)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Danh sách đánh giá */}
              <Card>
                <CardHeader>
                  <CardTitle>Nhận xét từ sinh viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedClass.ratings.map((rating) => (
                      <div key={rating.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              {rating.student.first_name} {rating.student.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{rating.student.account.email}</p>
                          </div>
                          <div className="text-right">
                            <StarRating rating={rating.rating} readonly size="sm" />
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(rating.created_at).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        {rating.comment && (
                          <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-500">
                            <p className="text-gray-700 italic">"{rating.comment}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassRatings;