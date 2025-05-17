import { NavLink } from "react-router-dom"
import { Home, BookOpen, Calendar, Users, Settings } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-md h-screen hidden md:flex flex-col">

      <nav className="flex-1 p-4 space-y-1">
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