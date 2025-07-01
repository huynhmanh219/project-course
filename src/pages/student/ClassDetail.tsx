import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { BookOpen, User2, FileText, Users, Info, CheckCircle, XCircle, FileDown, Play, Clock, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { simpleClassService } from "../../services";

interface ClassInfo {
  id: number;
  section_name: string;
  max_students: number;
  start_date: string;
  end_date: string;
  status: string;
  subject: {
    id: number;
    subject_name: string;
    subject_code: string;
    credits: number;
    description?: string;
  };
  lecturer: {
    id: number;
    first_name: string;
    last_name: string;
    title: string;
  };
  enrollmentCount?: number;
}

interface Lecture {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_published: boolean;
  chapter: {
    id: number;
    title: string;
    order_index: number;
  };
}

interface Material {
  id: number;
  title: string;
  description?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  material_type: string;
  is_public: boolean;
  created_at: string;
  uploader: {
    id: number;
    first_name: string;
    last_name: string;
    title: string;
  };
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
}

const ClassDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const classId = parseInt(id || '0');

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<number>>(new Set());
  
  const [loading, setLoading] = useState(true);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle chapter collapse
  const toggleChapter = (chapterId: number) => {
    const newCollapsed = new Set(collapsedChapters);
    if (newCollapsed.has(chapterId)) {
      newCollapsed.delete(chapterId);
    } else {
      newCollapsed.add(chapterId);
    }
    setCollapsedChapters(newCollapsed);
  };

  // Fetch class info
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await simpleClassService.getClass(classId);
        console.log('Class info response:', response);
        
        if (response && response.class) {
          setClassInfo(response.class);
        } else {
          setError('Không thể tải thông tin lớp học');
        }
      } catch (error: any) {
        console.error('Error fetching class info:', error);
        setError(error.message || 'Không thể tải thông tin lớp học');
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassInfo();
    }
  }, [classId]);

  // Fetch lectures
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoadingLectures(true);
        
        const response = await simpleClassService.getClassLectures(classId);
        console.log('Lectures response:', response);
        
        if (response && response.data) {
          console.log('Lectures data:', response.data);
          // Log chapter information for debugging
          response.data.forEach((lecture: any) => {
            console.log(`Lecture: ${lecture.title}, Chapter: ${lecture.chapter.title} (ID: ${lecture.chapter.id}, Order: ${lecture.chapter.order_index})`);
          });
          
          setLectures(response.data);
          // Set first lecture as selected
          if (response.data.length > 0 && !selectedLecture) {
            setSelectedLecture(response.data[0]);
          }
        }
      } catch (error: any) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoadingLectures(false);
      }
    };

    if (classId) {
      fetchLectures();
    }
  }, [classId]);

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoadingMaterials(true);
        
        const response = await simpleClassService.getClassMaterials(classId);
        console.log('Materials response:', response);
        
        if (response && response.data) {
          setMaterials(response.data);
        }
      } catch (error: any) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoadingMaterials(false);
      }
    };

    if (classId) {
      fetchMaterials();
    }
  }, [classId]);

  // Generate mock members data (since we don't have endpoint for this yet)
  useEffect(() => {
    if (classInfo) {
      const mockMembers: Member[] = [
        {
          id: classInfo.lecturer.id,
          first_name: classInfo.lecturer.first_name,
          last_name: classInfo.lecturer.last_name,
          role: 'Giáo viên'
        }
      ];
      setMembers(mockMembers);
    }
  }, [classInfo]);

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'document':
        return 'bg-red-100 text-red-800';
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'audio':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadMaterial = (material: Material) => {
    if (material.file_path) {
      const downloadUrl = `http://localhost:3000/uploads/${material.file_path}`;
      window.open(downloadUrl, '_blank');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-32"></div>
            <div className="bg-gray-200 rounded-3xl h-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !classInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <Button
            variant="default"
            className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
            onClick={() => navigate("/student/classes")}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Quay lại danh sách lớp học
          </Button>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-2xl p-8 text-white">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold">Có lỗi xảy ra</h1>
                <p className="text-red-100">{error || 'Không thể tải thông tin lớp học'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <Button
          variant="default"
          className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
          onClick={() => navigate("/student/classes")}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Quay lại danh sách lớp học
        </Button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{classInfo.section_name}</h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-2">
                    <User2 className="w-4 h-4" />
                    {classInfo.lecturer.title} {classInfo.lecturer.first_name} {classInfo.lecturer.last_name}
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {classInfo.subject.subject_name}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {classInfo.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-blue-100 text-lg">
              {classInfo.subject.description || `Môn học ${classInfo.subject.subject_name} - ${classInfo.subject.subject_code}`}
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{lectures.length}</div>
                <div className="text-sm text-gray-600">Bài giảng</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{materials.length}</div>
                <div className="text-sm text-gray-600">Tài liệu</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{members.length}</div>
                <div className="text-sm text-gray-600">Thành viên</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Improved Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Lecture Navigation */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-orange-600" />
                  </div>
                  Danh sách bài giảng
                  {loadingLectures && <div className="animate-spin w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full"></div>}
                </h2>
              </div>
              
              {lectures.length === 0 && !loadingLectures ? (
                <div className="p-12 text-center">
                  <Play className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có bài giảng nào</h3>
                  <p className="text-gray-500">Giáo viên chưa đăng tải bài giảng cho lớp học này</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Group lectures by chapter */}
                  {(() => {
                    // Group lectures by chapter
                    const groupedLectures = lectures.reduce((groups, lecture) => {
                      const chapterId = lecture.chapter.id;
                      if (!groups[chapterId]) {
                        groups[chapterId] = {
                          chapter: lecture.chapter,
                          lectures: []
                        };
                      }
                      groups[chapterId].lectures.push(lecture);
                      return groups;
                    }, {} as Record<number, { chapter: any; lectures: Lecture[] }>);

                    // Sort chapters by order_index
                    const sortedChapters = Object.values(groupedLectures).sort(
                      (a, b) => a.chapter.order_index - b.chapter.order_index
                    );

                    console.log('Grouped lectures:', groupedLectures);
                    console.log('Sorted chapters:', sortedChapters);

                    return sortedChapters.map((chapterGroup) => {
                      const isCollapsed = collapsedChapters.has(chapterGroup.chapter.id);
                      
                      return (
                        <div key={chapterGroup.chapter.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          {/* Chapter Header - Clickable */}
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-4 cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                            onClick={() => toggleChapter(chapterGroup.chapter.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold">{chapterGroup.chapter.order_index}</span>
                                </div>
                                <div className="text-white">
                                  <div className="font-semibold">Chương {chapterGroup.chapter.order_index}</div>
                                  <div className="text-blue-100 text-sm">{chapterGroup.chapter.title}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-white">
                                <span className="text-sm">{chapterGroup.lectures.length} bài</span>
                                {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                              </div>
                            </div>
                          </div>

                          {/* Chapter Lectures - Collapsible */}
                          {!isCollapsed && (
                            <div className="divide-y divide-gray-100">
                              {chapterGroup.lectures
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((lecture, lectureIndex) => (
                                <div
                                  key={lecture.id}
                                  onClick={() => setSelectedLecture(lecture)}
                                  className={`p-4 cursor-pointer transition-all duration-200 ${
                                    selectedLecture?.id === lecture.id
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-white hover:bg-orange-50 text-gray-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      selectedLecture?.id === lecture.id
                                        ? 'bg-white text-orange-500'
                                        : 'bg-orange-500 text-white'
                                    }`}>
                                      {lectureIndex + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold truncate">{lecture.title}</div>
                                      <div className={`text-sm mt-1 flex items-center gap-2 ${
                                        selectedLecture?.id === lecture.id ? 'text-orange-100' : 'text-gray-500'
                                      }`}>
                                        <Clock className="w-4 h-4" />
                                        {formatDuration(lecture.duration_minutes) || 'Chưa có thời lượng'}
                                      </div>
                                    </div>
                                    {lecture.is_published && (
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        selectedLecture?.id === lecture.id ? 'bg-white' : 'bg-green-500'
                                      }`}>
                                        <CheckCircle className={`w-4 h-4 ${
                                          selectedLecture?.id === lecture.id ? 'text-green-500' : 'text-white'
                                        }`} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Materials and Members in same column */}
            <div className="grid grid-cols-1 gap-6">
              {/* Materials */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Tài liệu lớp học
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {materials.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Chưa có tài liệu nào</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {materials.map(material => (
                        <div key={material.id} className="p-3 hover:bg-blue-50 transition-colors duration-200">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMaterialIcon(material.material_type)}`}>
                              {material.material_type.toUpperCase()}
                            </span>
                            <span className="font-medium flex-1 text-sm truncate">{material.title}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 px-2"
                              onClick={() => downloadMaterial(material)}
                            >
                              <FileDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Members */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Thành viên ({members.length})
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                        member.role === 'Giáo viên' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-800">{member.first_name} {member.last_name}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          member.role === 'Giáo viên' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Lecture Content */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {selectedLecture ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Lecture Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{selectedLecture.title}</h3>
                      <p className="text-orange-100">
                        Chương {selectedLecture.chapter.order_index}: {selectedLecture.chapter.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-orange-100">Thời lượng</div>
                        <div className="font-semibold text-lg">{formatDuration(selectedLecture.duration_minutes) || 'N/A'}</div>
                      </div>
                      {selectedLecture.is_published && (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Navigation buttons in header */}
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      disabled={lectures.findIndex(l => l.id === selectedLecture.id) === 0}
                      onClick={() => {
                        const currentIndex = lectures.findIndex(l => l.id === selectedLecture.id);
                        if (currentIndex > 0) {
                          setSelectedLecture(lectures[currentIndex - 1]);
                        }
                      }}
                    >
                      <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                      Bài trước
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-xs text-orange-100">Bài giảng</div>
                      <div className="font-semibold">
                        {lectures.findIndex(l => l.id === selectedLecture.id) + 1} / {lectures.length}
                      </div>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      disabled={lectures.findIndex(l => l.id === selectedLecture.id) === lectures.length - 1}
                      onClick={() => {
                        const currentIndex = lectures.findIndex(l => l.id === selectedLecture.id);
                        if (currentIndex < lectures.length - 1) {
                          setSelectedLecture(lectures[currentIndex + 1]);
                        }
                      }}
                    >
                      Bài tiếp
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Lecture Content */}
                <div className="p-6">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-orange-500">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                        {selectedLecture.content || 'Nội dung bài giảng chưa được cập nhật.'}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-center">
                    <Button variant="default" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                      <FileDown className="w-4 h-4 mr-2" />
                      Tải tài liệu bài giảng
                    </Button>
                  </div>
                </div> */}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Play className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Chọn một bài giảng</h3>
                <p className="text-gray-500">Chọn một bài giảng từ danh sách bên trái để xem nội dung</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail; 