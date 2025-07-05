import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import StarRating from '../../components/StarRating';
import { classRatingService } from '../../services/class-rating.service';
import { Search, Download, Eye, TrendingUp, Users, BookOpen } from 'lucide-react';
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

interface ClassInfo {
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

interface ClassRatingData {
  class_info: ClassInfo;
  ratings: ClassRating[];
  statistics: {
    averageRating: number;
    totalRatings: number;
    distribution: { [key: string]: number };
  };
}

const AdminClassRatings: React.FC = () => {
  const [allClassRatings, setAllClassRatings] = useState<ClassRatingData[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<ClassRatingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<ClassRatingData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [overallStats, setOverallStats] = useState({
    totalClasses: 0,
    totalRatings: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchAllClassRatings();
  }, []);

  useEffect(() => {
    filterRatings();
  }, [searchTerm, ratingFilter, allClassRatings]);

  const fetchAllClassRatings = async () => {
    try {
      setLoading(true);
      const classesData = await apiClient.get('/courses/classes?limit=100');
      if (classesData.status === 'success') {
        const promises = classesData.data.classes.map(async (cls: ClassInfo) => {
          try {
            const ratingsRes = await classRatingService.getClassRatings(cls.id);
            const raw: any = ratingsRes.data.statistics;
            const stats = {
              averageRating: parseFloat(raw.averageRating ?? raw.average_rating ?? 0),
              totalRatings: raw.totalRatings ?? raw.total_ratings ?? 0,
              distribution: raw.distribution ?? {}
            };
            return {
              class_info: cls,
              ratings: ratingsRes.data.ratings,
              statistics: stats
            } as ClassRatingData;
          } catch {
            return {
              class_info: cls,
              ratings: [],
              statistics: {
                averageRating: 0,
                totalRatings: 0,
                distribution: {}
              }
            } as ClassRatingData;
          }
        });
        const result = await Promise.all(promises);
        setAllClassRatings(result);
        const totalRatings = result.reduce((s, r) => s + r.statistics.totalRatings, 0);
        const avg = totalRatings > 0 ? result.reduce((s, r) => s + r.statistics.averageRating * r.statistics.totalRatings, 0) / totalRatings : 0;
        setOverallStats({ totalClasses: result.length, totalRatings, averageRating: avg });
      }
    } finally {
      setLoading(false);
    }
  };

  const filterRatings = () => {
    let arr = allClassRatings;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      arr = arr.filter(i =>
        i.class_info.section_name.toLowerCase().includes(t) ||
        i.class_info.subject.subject_name.toLowerCase().includes(t) ||
        i.class_info.subject.subject_code.toLowerCase().includes(t) ||
        `${i.class_info.lecturer.first_name} ${i.class_info.lecturer.last_name}`.toLowerCase().includes(t)
      );
    }
    if (ratingFilter !== 'all') {
      const min = parseInt(ratingFilter);
      arr = arr.filter(i => i.statistics.averageRating >= min && i.statistics.averageRating < min + 1);
    }
    setFilteredRatings(arr);
  };

  const exportCSV = () => {
    if (!filteredRatings.length) return;
    const rows = filteredRatings.map(r => ({
      Class: r.class_info.section_name,
      Subject: r.class_info.subject.subject_name,
      Code: r.class_info.subject.subject_code,
      Lecturer: `${r.class_info.lecturer.first_name} ${r.class_info.lecturer.last_name}`,
      Avg: r.statistics.averageRating.toFixed(1),
      Ratings: r.statistics.totalRatings
    }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(o => Object.values(o).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'class_ratings.csv';
    a.click();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6 grid grid-cols-3 gap-6 text-center">
          <div>
            <BookOpen className="mx-auto h-6 w-6 text-blue-600" />
            <p className="font-semibold">{overallStats.totalClasses}</p>
            <span className="text-sm text-gray-500">Lớp học</span>
          </div>
          <div>
            <Users className="mx-auto h-6 w-6 text-green-600" />
            <p className="font-semibold">{overallStats.totalRatings}</p>
            <span className="text-sm text-gray-500">Đánh giá</span>
          </div>
          <div>
            <TrendingUp className="mx-auto h-6 w-6 text-yellow-600" />
            <p className="font-semibold">{overallStats.averageRating.toFixed(1)}</p>
            <span className="text-sm text-gray-500">Điểm TB</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-40 bg-white text-gray-900 font-semibold">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><Button variant="outline" className="w-full">Tất cả</Button></SelectItem>
                <SelectItem value="4">4-5★</SelectItem>
                <SelectItem value="3">3-4★</SelectItem>
                <SelectItem value="2">2-3★</SelectItem>
                <SelectItem value="1">1-2★</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1"/>CSV</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRatings.map(item => (
          <Card key={item.class_info.id} className="hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{item.class_info.section_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">{item.class_info.subject.subject_name} ({item.class_info.subject.subject_code})</p>
              <p className="text-sm text-gray-500">GV: {item.class_info.lecturer.title} {item.class_info.lecturer.last_name}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={Number(item.statistics.averageRating)} readonly size="sm" />
                <span className="text-sm">{Number(item.statistics.averageRating).toFixed(1)} / {item.statistics.totalRatings} đánh giá</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => {setSelectedClass(item);setShowDetails(true);}}>Chi tiết</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {showDetails && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedClass.class_info.section_name}</h2>
              <Button variant="outline" onClick={() => setShowDetails(false)}>Đóng</Button>
            </div>
            <p className="mb-2 font-medium">Môn học: {selectedClass.class_info.subject.subject_name}</p>
            <p className="mb-2 font-medium">Giảng viên: {selectedClass.class_info.lecturer.title} {selectedClass.class_info.lecturer.first_name} {selectedClass.class_info.lecturer.last_name}</p>
            <div className="grid grid-cols-3 gap-4 my-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{Number(selectedClass.statistics.averageRating).toFixed(1)}</p>
                <p className="text-sm text-gray-600">Điểm trung bình</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{selectedClass.statistics.totalRatings}</p>
                <p className="text-sm text-gray-600">Tổng đánh giá</p>
              </div>
              <div className="text-center"><StarRating rating={Number(selectedClass.statistics.averageRating)} readonly /></div>
            </div>
            <div className="space-y-2">
              {[5,4,3,2,1].map(star=>{
                const count = selectedClass.statistics.distribution[star]||0;
                const percent = selectedClass.statistics.totalRatings>0?(count/Number(selectedClass.statistics.totalRatings))*100:0;
                return (
                  <div key={star} className="flex items-center">
                    <span className="w-8 text-sm">{star}★</span>
                    <div className="flex-1 bg-gray-200 h-2 mx-2 rounded">
                      <div className="bg-yellow-400 h-2 rounded" style={{width:`${percent}%`}}/>
                    </div>
                    <span className="w-12 text-sm text-right">{count}</span>
                  </div>
                )
              })}
            </div>
            <h3 className="mt-6 text-lg font-semibold">Nhận xét</h3>
            <div className="mt-2 space-y-4 max-h-60 overflow-y-auto">
              {selectedClass.ratings.map(r=>(
                <div key={r.id} className="border rounded p-3">
                  <p className="font-medium">{r.student.first_name} {r.student.last_name}</p>
                  <StarRating rating={r.rating} readonly size="sm" />
                  {r.comment && <p className="italic text-gray-700 mt-1">"{r.comment}"</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClassRatings; 