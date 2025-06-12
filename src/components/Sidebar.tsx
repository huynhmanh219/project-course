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
} from "lucide-react";

// Giả lập role, sau này lấy từ context hoặc API
const role: string = "student"; // "student" | "teacher" | "admin"

export function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 via-white to-indigo-50 border-r-2 border-blue-100 shadow-lg h-screen hidden md:flex flex-col">
      {/* <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-100 mb-2">
        <img src="/logo.jpg" alt="Class" className="h-10 w-10 rounded-full shadow border-2 border-blue-200" />
        <span className="text-2xl font-extrabold text-blue-800 tracking-tight drop-shadow">My Class</span>
      </div> */}
      <nav className="flex-1 p-4 space-y-2">
        {(role === "student") && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-base shadow-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-lg border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span>Trang chủ</span>
            </NavLink>
            <NavLink
              to="/student/classes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-base shadow-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-lg border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              <ClipboardList className="h-5 w-5" />
              <span>Lớp học để tham gia</span>
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-base shadow-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-lg border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              <BookOpen className="h-5 w-5" />
              <span>Khóa học của tôi</span>
            </NavLink>
            {/* <NavLink
              to="/people"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-base shadow-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-lg border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span>Mọi người</span>
            </NavLink> */}
            <NavLink
              to="/student/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-base shadow-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-lg border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              <User className="h-5 w-5" />
              <span>Thông tin cá nhân</span>
            </NavLink>
          </>
        )}
        {/* Teacher menu */}
        {role === "teacher" && (
          <>
            <NavLink
              to="/teacher/classes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <ClipboardList className="h-5 w-5" />
              <span>Lớp học của tôi</span>
            </NavLink>
            <NavLink
              to="/teacher/materials"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
            <FileText className="h-5 w-5" />
              <span>Quản lý tài liệu</span>
            </NavLink>
            <NavLink
              to="/teacher/courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <BookOpen className="h-5 w-5" />
              <span>Quản lý khóa học</span>
            </NavLink>
            <NavLink
              to="/teacher/my-classes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <Layers className="h-5 w-5" />
              <span>Quản lý lớp học</span>
            </NavLink>
            <NavLink
              to="/teacher/gradebook"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <BarChart2 className="h-5 w-5" />
              <span>Bảng điểm</span>
            </NavLink>
            <NavLink
              to="/teacher/students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span>Quản lý sinh viên</span>
            </NavLink>
          </>
        )}
        {/* Admin menu */}
        {role === "admin" && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Trang Chủ</span>
            </NavLink>

            <NavLink
              to="/admin/roles"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <Shield className="h-5 w-5" />
              <span>Quản lý vai trò</span>
            </NavLink>
            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <Briefcase className="h-5 w-5" />
              <span>Quản lý bộ môn</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <UserCog className="h-5 w-5" />
              <span>Quản lý giảng viên</span>
            </NavLink>


            <NavLink
              to="/admin/statistics"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <FileBarChart2 className="h-5 w-5" />
              <span>Thống kê</span>
            </NavLink>
          </>
        )}

        {/* <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
              isActive
                ? "bg-blue-100 text-blue-700 shadow"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink> */}

      </nav>
    </aside>
  )
} 