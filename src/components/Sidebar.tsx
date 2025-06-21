import { NavLink } from "react-router-dom"
import { Home, 
  BookOpen,
  Calendar,
  Users,
  Settings,
  ClipboardList,
  UserPlus,
  BarChart2,
  LayoutDashboard,
  UserCog,
  Layers,
  FileBarChart2,
  User,
  Shield,
  Briefcase,
  FileText,
  BookOpenCheck,
  Building,
  CheckSquare,
} from "lucide-react";

// Giả lập role, sau này lấy từ context hoặc API
const role: string = "student"; // "student" | "teacher" | "admin"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
    isActive
      ? "bg-blue-100 text-blue-800 shadow-lg border-l-4 border-blue-600 font-semibold"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
  }`;

const sectionTitleClass = "text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-4 first:mt-0 border-b border-gray-100 pb-2";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <LayoutDashboard className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-800">My Class</span>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Student menu */}
        {role === "student" && (
          <>
            <div className={sectionTitleClass}>Học tập</div>
            <NavLink to="/" className={navLinkClass}>
              <Home className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Trang chủ</span>
            </NavLink>
            <NavLink to="/student/classes" className={navLinkClass}>
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Lớp học đã tham gia</span>
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Môn học của tôi</span>
            </NavLink>
            <NavLink to="/student/quiz" className={navLinkClass}>
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Bài kiểm tra</span>
            </NavLink>
          </>
        )}

        {/* Teacher menu */}
        {role === "teacher" && (
          <>
            <div className={sectionTitleClass}>Quản lý học tập</div>
            <NavLink to="/teacher/my-classes" className={navLinkClass}>
              <Layers className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý lớp học phần</span>
            </NavLink>
            <NavLink to="/teacher/courses" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý môn học</span>
            </NavLink>
            <NavLink to="/teacher/lectures" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý bài giảng</span>
            </NavLink>
            <NavLink to="/teacher/chapters" className={navLinkClass}>
              <BookOpenCheck className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý chương</span>
            </NavLink>
            <NavLink to="/teacher/materials" className={navLinkClass}>
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý tài liệu</span>
            </NavLink>
            <NavLink to="/teacher/quiz" className={navLinkClass}>
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý bài kiểm tra</span>
            </NavLink>
            
            <div className={sectionTitleClass}>Quản lý người dùng</div>
            <NavLink to="/teacher/students" className={navLinkClass}>
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý sinh viên</span>
            </NavLink>
            <NavLink to="/teacher/classes" className={navLinkClass}>
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Lớp học của tôi</span>
            </NavLink>
          </>
        )}

        {/* Admin menu */}
        {role === "admin" && (
          <>
            <div className={sectionTitleClass}>Quản trị hệ thống</div>
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Trang chủ</span>
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              <UserCog className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý người dùng</span>
            </NavLink>
            <NavLink to="/admin/roles" className={navLinkClass}>
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Thông tin vai trò</span>
            </NavLink>
            {/* <NavLink to="/admin/departments" className={navLinkClass}>
              <Building className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý khoa</span>
            </NavLink> */}
            <NavLink to="/admin/statistics" className={navLinkClass}>
              <FileBarChart2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Thống kê</span>
            </NavLink>
            
            <div className={sectionTitleClass}>Quản lý học tập</div>
            <NavLink to="/teacher/my-classes" className={navLinkClass}>
              <Layers className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý lớp học phần</span>
            </NavLink>
            <NavLink to="/teacher/courses" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý môn học</span>
            </NavLink>
            <NavLink to="/teacher/lectures" className={navLinkClass}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý bài giảng</span>
            </NavLink>
            <NavLink to="/teacher/chapters" className={navLinkClass}>
              <BookOpenCheck className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý chương</span>
            </NavLink>
            <NavLink to="/teacher/materials" className={navLinkClass}>
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý tài liệu</span>
            </NavLink>
            <NavLink to="/teacher/quiz" className={navLinkClass}>
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý bài kiểm tra</span>
            </NavLink>
            
            <div className={sectionTitleClass}>Quản lý người dùng</div>
            <NavLink to="/teacher/students" className={navLinkClass}>
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Quản lý sinh viên</span>
            </NavLink>
            <NavLink to="/teacher/classes" className={navLinkClass}>
              <ClipboardList className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Lớp học của tôi</span>
            </NavLink>
          </>
        )}
        
        {/* Spacing for better UX */}
        <div className="h-4"></div>
      </nav>
      
      {/* Footer - Fixed at bottom */}
      <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-gray-50 to-blue-50 flex-shrink-0">
        {/* <div className="text-xs text-gray-500 text-center font-medium">
          © 2024 My Class System
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">
          v1.0.0
        </div> */}
      </div>
    </aside>
  )
} 