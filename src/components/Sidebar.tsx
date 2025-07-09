import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Home, 
  BookOpen,
  Users,
  Settings,
  ClipboardList,
  LayoutDashboard,
  UserCog,
  Layers,
  FileBarChart2,
  User,
  Shield,
  FileText,
  CheckSquare,
  Crown,
  GraduationCap,
  UserCheck,
  Star
} from "lucide-react";
import { authService } from "../services/auth.service";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
    isActive
      ? "bg-blue-100 text-blue-800 shadow-lg border-l-4 border-blue-600 font-semibold"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
  }`;

const sectionTitleClass = "text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-4 first:mt-0 border-b border-gray-100 pb-2";

export function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setRole(currentUser.role || '');
    }
  }, []);

  const isStudent = () => role === 'student';
  const isTeacher = () => role === 'lecturer' || role === 'teacher';
  const isAdmin = () => role === 'admin';
  const canAccessTeacherFeatures = () => isTeacher() || isAdmin(); 
  const canAccessAdminFeatures = () => isAdmin();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          {isAdmin() ? (
            <Crown className="h-4 w-4 text-white" />
          ) : isTeacher() ? (
            <GraduationCap className="h-4 w-4 text-white" />
          ) : (
            <UserCheck className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">LMS Portal</span>
          {user && (
            <span className="text-xs text-gray-600">
              {isAdmin() ? '👑 Quản trị viên' : isTeacher() ? '🎓 Giảng Viên' : '📚 Sinh viên'}
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        
        {canAccessAdminFeatures() && (
          <>
            <div className={sectionTitleClass}>
              <Crown className="h-3 w-3 inline mr-1" />
              Quản trị hệ thống
            </div>
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Trang chủ</span>
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              <UserCog className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý giảng viên</span>
            </NavLink>
            <NavLink to="/admin/roles" className={navLinkClass}>
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Thông tin vai trò</span>
            </NavLink>
            <NavLink to="/admin/statistics" className={navLinkClass}>
              <FileBarChart2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Thống kê hệ thống</span>
            </NavLink>
            <NavLink to="/admin/class-ratings" className={navLinkClass}>
              <Star className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý đánh giá lớp học</span>
            </NavLink>

          </>
        )}

        {canAccessTeacherFeatures() && (
          <>
            <div className={sectionTitleClass}>
              <GraduationCap className="h-3 w-3 inline mr-1" />
              Quản lý giảng dạy
            </div>
            <NavLink to="/teacher/courses" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Môn học</span>
            </NavLink>
            {isTeacher() && (
            <NavLink to="/teacher/my-classes" className={navLinkClass}>
              <Layers className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Danh Sách lớp học phần</span>
            </NavLink>
            )}
            <NavLink to="/teacher/materials" className={navLinkClass}>
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Tài liệu</span>
            </NavLink>
            <NavLink to="/teacher/quiz" className={navLinkClass}>
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý câu hỏi</span>
            </NavLink>
            <NavLink to="/teacher/class-ratings" className={navLinkClass}>
              <Star className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Đánh giá lớp học</span>
            </NavLink>
            
            <div className={sectionTitleClass}>
              <Users className="h-3 w-3 inline mr-1" />
              Sinh viên & Lớp học
            </div>
            <NavLink to="/teacher/students" className={navLinkClass}>
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý sinh viên</span>
            </NavLink>
            {isTeacher() && (
            <NavLink to="/teacher/classes" className={navLinkClass}>
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Lớp học phần của tôi</span>
            </NavLink>
            )}
            {/* <NavLink to="/teacher/gradebook" className={navLinkClass}>
              <BarChart2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Sổ điểm</span>
            </NavLink> */}
          </>
        )}

        {isStudent() && (
          <>
            <div className={sectionTitleClass}>
              <UserCheck className="h-3 w-3 inline mr-1" />
              Học tập
            </div>
            <NavLink to="/" className={navLinkClass}>
              <Home className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Trang chủ</span>
            </NavLink>
            <NavLink to="/student/classes" className={navLinkClass}>
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Lớp học phần của tôi</span>
            </NavLink>
            {/* <NavLink to="/courses" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Khóa học</span>
            </NavLink> */}
            <NavLink to="/student/quiz" className={navLinkClass}>
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Bài kiểm tra</span>
            </NavLink>
          </>
        )}

        <div className={sectionTitleClass}>
          <User className="h-3 w-3 inline mr-1" />
          Tài khoản
        </div>
        
        <NavLink 
          to={
            isAdmin() ? '/admin/profile' : 
            isTeacher() ? '/teacher/profile' : 
            '/student/profile'
          } 
          className={navLinkClass}
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Thông tin cá nhân</span>
        </NavLink>

        <NavLink 
          to={
            isAdmin() ? '/admin/change-password' : 
            isTeacher() ? '/teacher/change-password' : 
            '/student/change-password'
          } 
          className={navLinkClass}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Đổi mật khẩu</span>
        </NavLink>
        
        <div className="h-4"></div>
      </nav>
      
      <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-gray-50 to-blue-50 flex-shrink-0">
        {user && (
          <div className="text-xs text-gray-600">
            <div className="font-medium truncate">{user.userName || user.email}</div>
            <div className="text-gray-400 flex items-center gap-1">
              {isAdmin() && <Crown className="h-3 w-3" />}
              {isTeacher() && <GraduationCap className="h-3 w-3" />}
              {isStudent() && <UserCheck className="h-3 w-3" />}
              <span className="capitalize">{role === 'lecturer' ? 'Giảng viên' : role === "student"?"sinh viên":role ==="admin"?"quản trị viên":"quản trị viên" }</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
} 