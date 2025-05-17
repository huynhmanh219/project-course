import { NavLink } from "react-router-dom"
import { Home, BookOpen, Calendar, Users, Settings } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/course"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BookOpen className="h-5 w-5" />
          <span>Classes</span>
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Calendar className="h-5 w-5" />
          <span>Calendar</span>
        </NavLink>
        <NavLink
          to="/people"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Users className="h-5 w-5" />
          <span>People</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
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