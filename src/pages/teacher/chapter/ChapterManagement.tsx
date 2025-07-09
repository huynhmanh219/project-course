import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Plus, BookOpen, FileText, Video, Calendar, 
  Edit, Trash2, ChevronDown, ChevronRight, Upload,
  PlayCircle, Download, Eye
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

// Mock data structure - replace with actual API calls
interface Chapter {
  id: number;
  title: string;
  description: string;
  order_index: number;
  status: 'active' | 'draft';
  subject_id: number;
  created_at: string;
  lectures: Lecture[];
  materials: Material[];
}

interface Lecture {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  duration_minutes?: number;
  is_published: boolean;
  chapter_id: number;
}

interface Material {
  id: number;
  title: string;
  description?: string;
  file_name?: string;
  file_size?: number;
  material_type: 'document' | 'video' | 'audio' | 'image' | 'link';
  is_public: boolean;
  chapter_id: number;
  created_at: string;
}

const ChapterManagement: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<{ [key: number]: 'lectures' | 'materials' }>({});

  useEffect(() => {
    const mockChapters: Chapter[] = [
      {
        id: 1,
        title: "Chương 1: Giới thiệu về Lập trình",
        description: "Những kiến thức cơ bản về lập trình máy tính",
        order_index: 1,
        status: 'active',
        subject_id: parseInt(subjectId || '1'),
        created_at: new Date().toISOString(),
        lectures: [
          {
            id: 1,
            title: "Bài 1.1: Khái niệm lập trình",
            content: "Nội dung bài học về khái niệm lập trình...",
            video_url: "https://example.com/video1",
            duration_minutes: 30,
            is_published: true,
            chapter_id: 1
          }
        ],
        materials: [
          {
            id: 1,
            title: "Slide bài giảng chương 1",
            description: "Slide PowerPoint cho chương 1",
            file_name: "chapter1_slides.pptx",
            file_size: 2048000,
            material_type: 'document',
            is_public: true,
            chapter_id: 1,
            created_at: new Date().toISOString()
          }
        ]
      }
    ];
    
    setChapters(mockChapters);
    setLoading(false);
  }, [subjectId]);

  const toggleChapterExpansion = (chapterId: number) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const setChapterTab = (chapterId: number, tab: 'lectures' | 'materials') => {
    setActiveTab(prev => ({ ...prev, [chapterId]: tab }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'audio': return <PlayCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="text-xl">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quản lý chương</h1>
              <p className="text-blue-100">Tổ chức nội dung theo từng chương học</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/teacher/courses/${subjectId}/chapters/add`)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm chương
              </Button>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const currentTab = activeTab[chapter.id] || 'lectures';
            
            return (
              <Card key={chapter.id} className="shadow-lg border-0">
                {/* Chapter Header */}
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleChapterExpansion(chapter.id)}
                        className="p-1"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {chapter.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            chapter.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {chapter.status === 'active' ? 'Hoạt động' : 'Nháp'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{chapter.description}</p>
                        
                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            {chapter.lectures.length} bài giảng
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {chapter.materials.length} tài liệu
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(chapter.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/teacher/courses/${subjectId}/chapters/${chapter.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Chapter Content */}
                {isExpanded && (
                  <CardContent className="p-6">
                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                      <button
                        onClick={() => setChapterTab(chapter.id, 'lectures')}
                        className={`px-4 py-2 rounded-md font-medium transition-all ${
                          currentTab === 'lectures'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Video className="w-4 h-4 inline mr-2" />
                        Bài giảng ({chapter.lectures.length})
                      </button>
                      <button
                        onClick={() => setChapterTab(chapter.id, 'materials')}
                        className={`px-4 py-2 rounded-md font-medium transition-all ${
                          currentTab === 'materials'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <FileText className="w-4 h-4 inline mr-2" />
                        Tài liệu ({chapter.materials.length})
                      </button>
                    </div>

                    {/* Lectures Tab */}
                    {currentTab === 'lectures' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-800">Danh sách bài giảng</h4>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/teacher/courses/${subjectId}/chapters/${chapter.id}/lectures/add`)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm bài giảng
                          </Button>
                        </div>
                        
                        {chapter.lectures.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Chưa có bài giảng nào</p>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {chapter.lectures.map((lecture) => (
                              <div key={lecture.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Video className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-800">{lecture.title}</h5>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      {lecture.duration_minutes && (
                                        <span>{lecture.duration_minutes} phút</span>
                                      )}
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        lecture.is_published 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}>
                                        {lecture.is_published ? 'Đã xuất bản' : 'Nháp'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Materials Tab */}
                    {currentTab === 'materials' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-800">Tài liệu chương</h4>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/teacher/materials/add?chapter_id=${chapter.id}`)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Thêm tài liệu
                          </Button>
                        </div>
                        
                        {chapter.materials.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Chưa có tài liệu nào</p>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {chapter.materials.map((material) => (
                              <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    {getFileIcon(material.material_type)}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-800">{material.title}</h5>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      {material.file_size && (
                                        <span>{formatFileSize(material.file_size)}</span>
                                      )}
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        material.is_public 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-orange-100 text-orange-700'
                                      }`}>
                                        {material.is_public ? 'Công khai' : 'Riêng tư'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {chapters.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có chương nào
              </h3>
              <p className="text-gray-500 mb-4">
                Tạo chương đầu tiên để bắt đầu tổ chức nội dung
              </p>
              <Button
                onClick={() => navigate(`/teacher/courses/${subjectId}/chapters/add`)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo chương đầu tiên
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterManagement; 