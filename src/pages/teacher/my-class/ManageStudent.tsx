// src/pages/TeacherManageStudents.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, UserPlus, Edit, Trash2, CheckCircle, XCircle, Search, GraduationCap, Mail, Phone, UserCheck, UserX, Loader2, Calendar, Plus, AlertCircle, RefreshCw, Upload } from "lucide-react";
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { simpleCourseService } from '../../../services';
import Papa from 'papaparse';

interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  avatar?: string;
  enrollments: Array<{
    enrollment_date: string;
    status: string;
  }>;
  account: {
    id: number;
    email: string;
    is_active: boolean;
  };
}

interface ClassInfo {
  id: number;
  section_name: string;
}

const ManageStudent: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{successful:number;failed:number}>({successful:0,failed:0});
  const navigate = useNavigate();

  const loadClassStudents = async (page = 1, search = '') => {
    if (!classId) {
      setError('Không tìm thấy ID lớp học');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params: any = {
        page: page.toString(),
        limit: pagination.limit.toString()
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      console.log(`Loading students for class ${classId} with params:`, params);
      const response = await simpleCourseService.getClassStudents(Number(classId), params);
      
      console.log('Class students API response:', response);
      
      if (response.students) {
        setStudents(response.students);
        setClassInfo(response.class);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages
          });
        }
      } else {
        setError('Không thể tải danh sách sinh viên');
      }
    } catch (error: any) {
      console.error('Error loading class students:', error);
      setError(error.message || 'Lỗi khi tải danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassStudents();
  }, [classId]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadClassStudents(1, searchTerm);
  };

  const filteredStudents = students.filter(student => {
    if (!searchTerm.trim()) return true;
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const studentId = student.student_id.toLowerCase();
    const email = student.account.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || studentId.includes(search) || email.includes(search);
  });

  const activeStudents = students.filter(s => s.account.is_active).length;
  const inactiveStudents = students.filter(s => !s.account.is_active).length;

  const handleRemoveStudent = async (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    const fullName = student ? `${student.first_name} ${student.last_name}` : 'Sinh viên';
    const confirmMessage = `Bạn có chắc chắn muốn xóa sinh viên "${fullName}" khỏi lớp học này không?\n\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await simpleCourseService.removeStudentFromClass(Number(classId), studentId);
        alert("Đã xóa sinh viên khỏi lớp học thành công!");
        loadClassStudents(pagination.page, searchTerm);
      } catch (error: any) {
        alert(`Lỗi khi xóa sinh viên: ${error.message}`);
      }
    }
  };

  const handleImportStudents = () => {
    if (!importFile) {
      alert('Vui lòng chọn file CSV');
      return;
    }

    console.log('Parsing CSV file:', importFile.name);
    
    // Function to process CSV results
    const processResults = async (results: any, hasHeader: boolean) => {
      console.log('CSV parsing results:', results);
      
      // Check for critical parsing errors (not just warnings)
      if (results.errors && results.errors.length > 0) {
        const criticalErrors = results.errors.filter((e: any) => e.type === 'Quotes' || e.type === 'Delimiter');
        if (criticalErrors.length > 0) {
          console.error('Critical CSV parsing errors:', criticalErrors);
          alert('Lỗi đọc file CSV: ' + criticalErrors.map((e: any) => e.message).join(', '));
          return;
        }
        // Log warnings but continue processing
        console.warn('CSV parsing warnings (non-critical):', results.errors);
      }

      if (!results.data || results.data.length === 0) {
        alert('File CSV trống hoặc không có dữ liệu hợp lệ');
        return;
      }

      console.log('First few rows:', results.data.slice(0, 3));
      console.log('Parse mode:', hasHeader ? 'with header' : 'without header');

      // Extract student IDs with improved logic
      const rawIds: any[] = [];
      
      results.data.forEach((row: any, index: number) => {
        console.log(`Processing row ${index + 1}:`, row);
        
        if (!row) {
          console.log(`Row ${index + 1}: Empty row, skipping`);
          return;
        }

        let studentId = null;
        
        if (!hasHeader || Array.isArray(row)) {
          // No header mode or array format - use first element
          const firstValue = Array.isArray(row) ? row[0] : row;
          studentId = firstValue;
          console.log(`Row ${index + 1}: No header mode, using first value:`, studentId);
        } else if (typeof row === 'object') {
          // Object format (normal CSV with headers)
          const possibleKeys = ['student_id', 'id', 'mssv', 'studentid'];
          for (const key of possibleKeys) {
            if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
              studentId = row[key];
              console.log(`Row ${index + 1}: Found via key '${key}':`, studentId);
              break;
            }
          }

          // If no header match, try the first non-empty value
          if (!studentId) {
            const values = Object.values(row).filter(v => 
              v !== null && v !== undefined && String(v).trim() !== ''
            );
            if (values.length > 0) {
              studentId = values[0];
              console.log(`Row ${index + 1}: Using first non-empty value:`, studentId);
            }
          }
        } else {
          // Primitive value
          studentId = row;
          console.log(`Row ${index + 1}: Primitive value:`, studentId);
        }

        if (studentId !== null && studentId !== undefined) {
          const cleanId = String(studentId).trim();
          if (cleanId !== '' && cleanId.toLowerCase() !== 'student_id' && cleanId.toLowerCase() !== 'mssv' && cleanId.toLowerCase() !== 'id') {
            console.log(`Row ${index + 1}: Adding ID:`, cleanId);
            rawIds.push(cleanId);
          } else {
            console.log(`Row ${index + 1}: Skipping header or empty ID:`, cleanId);
          }
        } else {
          console.log(`Row ${index + 1}: No valid student ID found`, row);
        }
      });

      console.log('Raw IDs extracted:', rawIds);

      // Process and filter valid IDs (support both numeric and string IDs)
      const validIds = Array.from(
        new Set(
          rawIds
            .map((v: any) => {
              const cleanId = String(v).trim();
              // Accept numeric IDs
              const numericId = parseInt(cleanId);
              if (!isNaN(numericId) && numericId > 0) {
                return numericId;
              }
              // Accept string IDs (alphanumeric, at least 3 characters)
              if (cleanId.length >= 3 && /^[A-Za-z0-9]+$/.test(cleanId)) {
                return cleanId;
              }
              return null;
            })
            .filter((id: any) => id !== null)
        )
      );

      console.log('Valid student IDs:', validIds);

      if (validIds.length === 0) {
        alert(`Không tìm thấy student_id hợp lệ trong file.\n\nFile cần có cột 'student_id', 'id', 'mssv' hoặc 'studentid' với ID hợp lệ (số hoặc chuỗi ít nhất 3 ký tự).\n\nSố dòng đã đọc: ${results.data.length}\nSố ID thô: ${rawIds.length}`);
        return;
      }

      const confirmMessage = `Tìm thấy ${validIds.length} student ID hợp lệ.\n\nBạn có muốn tiếp tục import không?\n\nDanh sách ID: ${validIds.slice(0, 10).join(', ')}${validIds.length > 10 ? '...' : ''}`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }

      setImporting(true);
      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      try {
        console.log(`Starting import for ${validIds.length} students in chunks of 100`);
        
        // Process in chunks of 100 students (bulkEnrollment API limit)
        for (let i = 0; i < validIds.length; i += 100) {
          const chunk = validIds.slice(i, i + 100);
          console.log(`Processing chunk ${Math.floor(i / 100) + 1}: IDs ${chunk[0]} to ${chunk[chunk.length - 1]}`);
          
          try {
            const result = await simpleCourseService.bulkEnrollStudents(Number(classId), chunk as (number | string)[]);
            console.log(`Chunk ${Math.floor(i / 100) + 1} result:`, result);
            
            // The bulkEnrollment API returns detailed results
            if (result && result.results) {
              successful += result.results.successful?.length || 0;
              failed += result.results.failed?.length || 0;
              
              // Add specific error details if any students failed
              if (result.results.failed?.length > 0) {
                const chunkErrors = result.results.failed.map((failure: any) => 
                  `ID ${failure.enrollment?.student_id || 'unknown'}: ${failure.error}`
                );
                errors.push(`Chunk ${Math.floor(i / 100) + 1}: ${chunkErrors.join(', ')}`);
              }
            } else {
              successful += chunk.length;
            }
          } catch (chunkError: any) {
            console.error(`Error in chunk ${Math.floor(i / 100) + 1}:`, chunkError);
            failed += chunk.length;
            errors.push(`Chunk ${Math.floor(i / 100) + 1}: ${chunkError.message}`);
          }
        }

        let message = `Import hoàn thành!\n\nThành công: ${successful} sinh viên\nThất bại: ${failed} sinh viên`;
        if (errors.length > 0) {
          message += `\n\nLỗi:\n${errors.join('\n')}`;
        }
        
        alert(message);
        setImportResult({ successful, failed });
        
        if (successful > 0) {
          loadClassStudents(); // Reload the student list
        }
        
        setShowImport(false);
      } catch (err: any) {
        console.error('Import error:', err);
        alert('Có lỗi khi import: ' + err.message);
      } finally {
        setImporting(false);
      }
    };

    // Try parsing with header first
    const parseWithHeader = () => {
      Papa.parse(importFile, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Normalize header names
          const normalized = header.trim().toLowerCase();
          if (normalized === 'student_id' || normalized === 'id' || normalized === 'mssv' || normalized === 'studentid') {
            return 'student_id';
          }
          return normalized;
        },
        complete: async (results: any) => {
          await processResults(results, true);
        },
        error: (error: any) => {
          console.error('Papa Parse error (with header):', error);
          console.log('Trying without header...');
          parseWithoutHeader();
        }
      });
    };

    // Fallback: parse without header
    const parseWithoutHeader = () => {
      Papa.parse(importFile, {
        header: false,
        skipEmptyLines: true,
        complete: async (results: any) => {
          await processResults(results, false);
        },
        error: (error: any) => {
          console.error('Papa Parse error (without header):', error);
          alert('Lỗi đọc file CSV: ' + error.message);
        }
      });
    };

    // Start parsing
    parseWithHeader();
  };

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
    const fullName = `${student.first_name} ${student.last_name}`;
    
    return (
      <div className="group h-full">
        <Card 
          className="h-full flex flex-col shadow-lg border border-gray-200 bg-white group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
          onClick={() => navigate(`/teacher/students/${student.account.id}`)}
        >
          {/* Header gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-3 shadow-lg flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm">
                  {student.first_name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                  {fullName}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {student.student_id}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    student.account.is_active 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {student.account.is_active ? (
                      <>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3 mr-1" />
                        Khóa
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-3 mb-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium truncate">{student.account.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-medium">{student.phone}</span>
                </div>
              )}
              {student.enrollments && student.enrollments.length > 0 && (
                <div className="text-xs text-gray-500">
                  Ghi danh: {new Date(student.enrollments[0].enrollment_date).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teacher/students/edit/${student.account.id}`);
                }}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700 hover:from-red-100 hover:to-rose-100 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStudent(student.id);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải danh sách sinh viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  Quản lý sinh viên lớp
                </h1>
                <p className="text-blue-100 text-lg">
                  {classInfo ? `Lớp: ${classInfo.section_name}` : 'Danh sách sinh viên trong lớp học này'}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{pagination.total}</div>
                  <div className="text-blue-100 text-sm">Tổng sinh viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeStudents}</div>
                  <div className="text-blue-100 text-sm">Hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inactiveStudents}</div>
                  <div className="text-blue-100 text-sm">Khóa</div>
                </div>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => navigate(`/teacher/classes/${classId}/add-student`)}
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Thêm sinh viên
                </Button>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3"
                  onClick={() => setShowImport(true)}
                >
                  <Upload className="w-4 h-4 mr-2"/> Nhập CSV
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={() => loadClassStudents()} 
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên theo tên, MSSV hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="px-6 py-3">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </form>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="default"
              onClick={() => loadClassStudents(pagination.page - 1, searchTerm)}
              disabled={pagination.page <= 1}
            >
              Trước
            </Button>
            <span className="px-4 py-2 bg-white rounded-lg border">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="default"
              onClick={() => loadClassStudents(pagination.page + 1, searchTerm)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Sau
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sinh viên nào</h3>
              <p className="text-gray-500">Lớp học này chưa có sinh viên đăng ký</p>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading && students.length > 0 && filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sinh viên nào</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          </div>
        )}

        {/* Back to Class Management */}
        <div className="flex justify-center">
          <Button
            variant="default"
            onClick={() => navigate('/teacher/my-classes')}
            className="px-6 py-3"
          >
            ← Quay về quản lý lớp học
          </Button>
        </div>

        {showImport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Nhập danh sách sinh viên</h3>
                    <p className="text-sm text-gray-600">Tải lên file CSV với danh sách MSSV</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn định dạng file CSV:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• File phải có cột với tên: <code className="bg-blue-100 px-1 rounded">student_id</code>, <code className="bg-blue-100 px-1 rounded">id</code>, <code className="bg-blue-100 px-1 rounded">mssv</code> hoặc <code className="bg-blue-100 px-1 rounded">studentid</code></li>
                    <li>• Mỗi dòng chứa một MSSV (số nguyên dương)</li>
                    <li>• Ví dụ: 20200001, 20200002, 20200003</li>
                    <li>• <strong>Hệ thống tự động tạo tài khoản cho sinh viên chưa có:</strong></li>
                    <li className="ml-4">- Email: <code className="bg-blue-100 px-1 rounded">[MSSV]@lms.com</code></li>
                    <li className="ml-4">- Mật khẩu mặc định: <code className="bg-blue-100 px-1 rounded">[MSSV]</code></li>
                    <li>• Tối đa 100 sinh viên mỗi lần import</li>
                  </ul>
                </div>

                {/* Sample download */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Tải file mẫu:</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const csvContent = "student_id\n20200001\n20200002\n20200003\n20200004\n20200005";
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'sample_student_import.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    📄 Tải file mẫu CSV
                  </Button>
                </div>

                {/* File input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn file CSV
                  </label>
                  <input 
                    type="file" 
                    accept=".csv,.txt" 
                    onChange={e => setImportFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {importFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Đã chọn: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {/* Import result */}
                {importResult.successful > 0 || importResult.failed > 0 ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Kết quả import gần nhất:</h4>
                    <div className="text-sm space-y-1">
                      <div className="text-green-600">✓ Thành công: {importResult.successful} sinh viên</div>
                      <div className="text-red-600">✗ Thất bại: {importResult.failed} sinh viên</div>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowImport(false)}
                    disabled={importing}
                  >
                    Hủy
                  </Button>
                  <Button 
                    disabled={importing || !importFile} 
                    onClick={handleImportStudents}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang nhập...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Bắt đầu nhập
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudent;