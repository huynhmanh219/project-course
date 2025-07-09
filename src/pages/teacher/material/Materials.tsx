import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Download, Edit, Trash2, Calendar, BookOpen, RefreshCw, AlertCircle,Video, Image, Link, Archive, Eye, ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { simpleMaterialService, type Material, type  MaterialQueryParams } from "../../../services/material.service.simple";
import { authService } from "../../../services/auth.service";

const Materials: React.FC = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  void isAuthenticated;
  const [stats, setStats] = useState({
    total: 0,
    by_type: {
      document: 0,
      video: 0,
      audio: 0,
      image: 0,
      link: 0
    }
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      console.log('Auth check - Token:', !!token);
      console.log('Auth check - User:', user);
      
      if (!token || !user) {
        setIsAuthenticated(false);
        setError('Bạn cần đăng nhập để xem tài liệu');
        setLoading(false);
        return false;
      }
      
      setIsAuthenticated(true);
      return true;
    };
    
    if (checkAuth()) {
      loadMaterials();
      loadStats();
    }
  }, []);

  // Load materials
  const loadMaterials = async (params?: MaterialQueryParams) => {
    try {
      setLoading(true);
      setError('');
      
      // Debug: Check authentication
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      
      if (!token) {
        setError('❌ Chưa đăng nhập! Vui lòng đăng nhập để xem tài liệu.');
        setMaterials([]);
        setLoading(false);
        return;
      }
      
      const queryParams: MaterialQueryParams = {
        page: currentPage,
        size: 20,
        ...params
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
      }
      
      if (selectedType) {
        queryParams.material_type = selectedType as any;
      }

      console.log('Loading materials with params:', queryParams);
      const response = await simpleMaterialService.getMaterials(queryParams);
      console.log('Raw response from service:', response);
      
      // Ensure we have a valid response structure
      if (!response) {
        console.warn('No response from service');
        setMaterials([]);
        setTotalPages(1);
        return;
      }

      // Handle different response structures
      let materialsList: Material[] = [];
      let totalPagesValue = 1;

      if (response.items && Array.isArray(response.items)) {
        materialsList = response.items;
        totalPagesValue = response.totalPages || Math.ceil((response.totalItems || response.items.length) / (queryParams.size || 20));
      } else if (response.data && Array.isArray(response.data)) {
        materialsList = response.data;
        totalPagesValue = response.totalPages || 1;
      } else if (Array.isArray(response)) {
        materialsList = response;
        totalPagesValue = 1;
      } else {
        console.warn('Unexpected response structure:', response);
        materialsList = [];
        totalPagesValue = 1;
      }

      console.log('Processed materials list:', materialsList);
      console.log('Total pages:', totalPagesValue);

      setMaterials(materialsList);
      setTotalPages(totalPagesValue);
      
    } catch (err: any) {
      console.error('Error loading materials:', err);
      
      if (err.message && (err.message.includes('Access denied') || err.message.includes('token'))) {
        setError('🔐 Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
      } else {
        setError(`⚠️ ${err.message || 'Không thể tải danh sách tài liệu'}`);
      }
      
      setMaterials([]); 
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await simpleMaterialService.getMaterialStats();
      setStats(statsData as any);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleDeleteMaterial = async (material: Material) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa tài liệu "${material.title}" không?\n\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await simpleMaterialService.deleteMaterial(material.id);
        alert("Đã xóa tài liệu thành công!");
        loadMaterials(); 
        loadStats();
      } catch (err: any) {
        console.error('Error deleting material:', err);
        alert(`Lỗi xóa tài liệu: ${err.message}`);
      }
    }
  };

  const handleDownloadMaterial = async (material: Material) => {
    try {
      await simpleMaterialService.downloadMaterial(material.id, material.file_name);
    } catch (err: any) {
      console.error('Error downloading material:', err);
      alert(`Lỗi tải xuống: ${err.message}`);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadMaterials();
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
    setCurrentPage(1);
    loadMaterials({ material_type: type as any });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMaterials();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Tài liệu';
      case 'video': return 'Video';
      case 'image': return 'Hình ảnh';
      case 'link': return 'Liên kết';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-indigo-100 text-indigo-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'link': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'image': return Image;
      case 'link': return Link;
      default: return Archive;
    }
  };

  const getGradientColors = (type: string) => {
    switch (type) {
      case 'document': return 'from-blue-500 to-indigo-500';
      case 'video': return 'from-indigo-500 to-purple-500';
      case 'image': return 'from-green-500 to-teal-500';
      case 'link': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileExtension = (filename?: string): string => {
    if (!filename) return '';
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const MaterialCard: React.FC<{ material: Material }> = ({ material }) => {
    const getUploaderName = (uploader: any) => {
      if (!uploader) return 'Không xác định';
      if (uploader.first_name && uploader.last_name) {
        return `${uploader.first_name} ${uploader.last_name}`;
      }
      return uploader.name || 'Không xác định';
    };

    const getSubjectName = (subject: any) => {
      if (!subject) return 'Không xác định';
      return subject.subject_name || subject.name || 'Không xác định';
    };

    const getSubjectCode = (subject: any) => {
      if (!subject) return '';
      return subject.subject_code || subject.code || '';
    };

    const TypeIcon = getTypeIcon(material.material_type);
    
    const isLink = material.material_type === 'link';
    const hasFile = !isLink && (material.file_path || material.file_name);

    const handleOpenLink = () => {
      if (material.file_path) {
        window.open(material.file_path, '_blank');
      }
    };

    const handlePreview = () => {
      if (material.material_type === 'image' && material.file_path) {
        window.open(material.file_path, '_blank');
      }
    };

    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden min-w-[300px]"
        >
          {/* Header gradient bar */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradientColors(material.material_type)}`} />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`rounded-xl bg-gradient-to-tr ${getGradientColors(material.material_type)} p-3 shadow-lg flex-shrink-0`}>
                <TypeIcon className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 leading-tight">
                  {material.title}
                </h3>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(material.material_type)}`}>
                    {getTypeLabel(material.material_type)}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {material.file_size && (
                      <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                        {formatFileSize(material.file_size)}
                      </span>
                    )}
                    {material.file_name && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                        {getFileExtension(material.file_name)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Material Info */}
            <div className="space-y-3 mb-4">
              {/* Subject Information */}
              {material.subject && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-medium truncate">
                    {getSubjectCode(material.subject) ? 
                      `${getSubjectCode(material.subject)} - ${getSubjectName(material.subject)}` : 
                      getSubjectName(material.subject)
                    }
                  </span>
                </div>
              )}
              
              {/* Chapter Information */}
              {material.chapter && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">Chương: {material.chapter.title}</span>
                </div>
              )}
              
              {/* File Information for non-link materials */}
              {!isLink && material.file_name && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Archive className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="truncate font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                    {material.file_name}
                  </span>
                </div>
              )}
              
              {/* Link Information */}
              {isLink && material.file_path && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="truncate text-blue-600 underline">
                    {material.file_path.length > 40 ? 
                      material.file_path.substring(0, 40) + '...' : 
                      material.file_path
                    }
                  </span>
                </div>
              )}
              
              {/* Uploader Information */}
              {material.uploader && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {getUploaderName(material.uploader).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>Tạo bởi: {getUploaderName(material.uploader)}</span>
                </div>
              )}
              
              {/* Creation Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>Ngày tạo: {new Date(material.created_at).toLocaleDateString('vi-VN')}</span>
              </div>

              {/* Public/Private Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${material.is_public ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <span className={material.is_public ? 'text-green-600' : 'text-orange-600'}>
                  {material.is_public ? 'Công khai' : 'Riêng tư'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 mb-4">
              {material.description ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Mô tả:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {material.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Không có mô tả</p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
              {/* Primary Action Button */}
              {isLink ? (
                <Button 
                  className={`w-full bg-gradient-to-r ${getGradientColors(material.material_type)} hover:opacity-90 text-white font-medium`}
                  onClick={handleOpenLink}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> 
                  Mở liên kết
                </Button>
              ) : hasFile ? (
                <div className="flex gap-2">
                  <Button 
                    className={`flex-1 bg-gradient-to-r ${getGradientColors(material.material_type)} hover:opacity-90 text-white font-medium`}
                    onClick={() => handleDownloadMaterial(material)}
                  >
                    <Download className="w-4 h-4 mr-2" /> 
                    Tải xuống
                  </Button>
                  {material.material_type === 'image' && (
                    <Button 
                      variant="outline"
                      className="px-3"
                      onClick={handlePreview}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="w-full p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                  Không có file đính kèm
                </div>
              )}
              
              {/* Edit and Delete Buttons */}
              <div className="flex gap-3 min-w-0">
                <Button 
                  variant="outline" 
                  className="flex-1 min-w-[120px] bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium py-2.5 px-3 text-sm"
                  onClick={() => navigate(`/teacher/materials/edit/${material.id}`)}
                >
                  <Edit className="w-4 h-4 mr-1.5" /> Chỉnh sửa
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 min-w-[100px] bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium py-2.5 px-3 text-sm"
                  onClick={() => handleDeleteMaterial(material)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Xóa
                </Button>
              </div>

              {/* Additional Info Row */}
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
                <span>ID: {material.id}</span>
                {material.updated_at && material.updated_at !== material.created_at && (
                  <span>Cập nhật: {new Date(material.updated_at).toLocaleDateString('vi-VN')}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý tài liệu</h1>
                <p className="text-blue-100 text-lg">Tạo, chỉnh sửa, xóa và quản lý các tài liệu học tập</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.by_type.document || 0}</div>
                  <div className="text-blue-100 text-sm">📄 Tài liệu</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.by_type.video || 0}</div>
                  <div className="text-blue-100 text-sm">🎥 Video</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.by_type.image || 0}</div>
                  <div className="text-blue-100 text-sm">🖼️ Hình ảnh</div>
                </div>
                {/* <div className="text-center">
                  <div className="text-2xl font-bold">{stats.by_type.link || 0}</div>
                  <div className="text-blue-100 text-sm">🔗 Liên kết</div>
                </div> */}
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total || 0}</div>
                  <div className="text-blue-100 text-sm">Tổng cộng</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate('/teacher/materials/add')}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm tài liệu
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {/* <button
                onClick={() => handleTypeFilter(null)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === null
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTypeFilter('document')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === 'document'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📄 Tài liệu
              </button>
              <button
                onClick={() => handleTypeFilter('video')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === 'video'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎥 Video
              </button>
              <button
                onClick={() => handleTypeFilter('image')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedType === 'image'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🖼️ Hình ảnh
              </button> */}
              <Button
                variant="outline"
                onClick={() => {
                  loadMaterials();
                  loadStats();
                }}
                className="px-4 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadMaterials()}
                className="ml-auto"
              >
                Thử lại
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <RefreshCw className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Đang tải tài liệu...
              </h3>
            </div>
          </div>
        )}

        {/* Materials Grid */}
        {!loading && materials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
            {materials.map((material) => (
              <div key={material.id} className="min-w-[320px]">
                <MaterialCard material={material} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && materials.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy tài liệu nào
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedType ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' : 'Chưa có tài liệu nào được tạo'}
              </p>
              <Button
                onClick={() => navigate('/teacher/materials/add')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo tài liệu đầu tiên
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials; 