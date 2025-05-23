import { NavLink } from "react-router-dom"
import { Home, BookOpen, Calendar, Users, Settings, ClipboardList, UserPlus, BarChart2, LayoutDashboard, UserCog, Layers, FileBarChart2 } from "lucide-react"

// Giả lập role, sau này lấy từ context hoặc API
const role: string = "teacher"; // "student" | "teacher" | "admin"

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-md h-screen hidden md:flex flex-col">
      <nav className="flex-1 p-4 space-y-1">

        {/* Student & Teacher menu */}
        {(role === "student" || role === "teacher") && (
          <>
          <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
              isActive
                ? "bg-blue-100 text-blue-700 shadow"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
            <NavLink
              to="/course"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <BookOpen className="h-5 w-5" />
              <span>Classes</span>
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </NavLink>
            <NavLink
              to="/people"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span>People</span>
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
              <BookOpen className="h-5 w-5" />
              <span>My Classes</span>
            </NavLink>
            <NavLink
              to="/teacher/create-assignment"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <ClipboardList className="h-5 w-5" />
              <span>Create Assignment</span>
            </NavLink>
            <NavLink
              to="/teacher/manage-students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition text-base ${
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                }`
              }
            >
              <UserPlus className="h-5 w-5" />
              <span>Manage Students</span>
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
              <span>Gradebook</span>
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
              <span>Dashboard</span>
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
              <span>Quản lý người dùng</span>
            </NavLink>
            <NavLink
              to="/admin/classes"
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
              to="/admin/courses"
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
        <NavLink
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
        </NavLink>
      </nav>
    </aside>
  )
} 