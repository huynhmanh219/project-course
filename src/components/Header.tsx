import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { Search,  User, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { authService } from "../services/auth.service"

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleProfile = () => {
    if (user?.role) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/profile');
          break;
        case 'lecturer':
          navigate('/teacher/profile');
          break;
        case 'student':
          navigate('/student/profile');
          break;
        default:
          navigate('/profile');
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  const userName = user?.userName || user?.email || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userRole = user?.role || '';
      
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'lecturer': return 'Giảng viên';
      case 'student': return 'Sinh viên';
      default: return '';
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-blue-50 via-white to-indigo-50 shadow-sm">
      <div className="flex items-center gap-$">
        <img src="/logo.jpg" alt="Class" className="h-10 w-10 rounded-full shadow-lg border-2 border-blue-200" />
        <span className="text-2xl font-extrabold text-blue-800 tracking-tight drop-shadow">LMS Portal</span>
      </div>

      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        {/* <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khoá học, lớp học..."
            className="w-full pl-12 pr-4 py-2 rounded-full border border-blue-200 bg-white focus:outline-none focus:border-blue-500 shadow-sm text-base text-gray-700 placeholder:text-gray-400"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border-2 border-blue-200 hover:border-blue-400 transition">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-blue-800">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
                {userRole && (
                  <p className="text-xs leading-none text-blue-600 font-medium">
                    {getRoleDisplayName(userRole)}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 
