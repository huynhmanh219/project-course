import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classRatingService } from '../../services/class-rating.service';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Star, Check, ChevronLeft } from 'lucide-react';

interface PendingItem {
  id: number;
  rating: number;
  comment?: string;
  created_at: string;
  student?: { first_name: string; last_name: string };
  courseSection?: { id:number; section_name:string };
}

const PendingClassRatings: React.FC = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await classRatingService.getPendingRatings();
      setRatings(res.ratings || res.data?.ratings || []);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (id: number) => {
    if (!window.confirm('Duyệt đánh giá này?')) return;
    try {
      await classRatingService.approveRating(id);
      setRatings(prev => prev.filter(r => r.id !== id));
    } catch (err:any){ alert(err.message); }
  };

  if (loading) return <p className="p-4">Đang tải...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đánh giá chờ duyệt ({ratings.length})</h1>
        <Button variant="outline" onClick={()=>navigate('/admin/class-ratings')} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4"/> Quay lại
        </Button>
      </div>
      {ratings.length === 0 ? (
        <p>Không có đánh giá nào.</p>
      ) : (
        ratings.map(item => (
          <Card key={item.id} className="shadow">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_,i)=>(
                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                {item.comment && <p className="text-gray-700 mb-2">{item.comment}</p>}
                <p className="text-sm text-gray-500">Lớp: {item.courseSection?.section_name} • {new Date(item.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-500">SV: {item.student?.first_name} {item.student?.last_name}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={()=>handleApprove(item.id)} className="bg-green-600 hover:bg-green-700 text-white h-9 px-4">
                  <Check className="w-4 h-4 mr-1"/> Duyệt
                </Button>
                {/* Future: nút từ chối */}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PendingClassRatings; 