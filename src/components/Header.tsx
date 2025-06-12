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
import { Search, Bell, User } from "lucide-react"

export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-blue-50 via-white to-indigo-50 shadow-sm">
      <div className="flex items-center gap-4">
        <img src="/logo.jpg" alt="Class" className="h-10 w-10 rounded-full shadow-lg border-2 border-blue-200" />
        <span className="text-2xl font-extrabold text-blue-800 tracking-tight drop-shadow">My Class</span>
      </div>

      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khoá học, lớp học..."
            className="w-full pl-12 pr-4 py-2 rounded-full border border-blue-200 bg-white focus:outline-none focus:border-blue-500 shadow-sm text-base text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-blue-100">
          <Bell className="h-6 w-6 text-blue-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-blue-100">
          <User className="h-6 w-6 text-blue-500" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border-2 border-blue-200 hover:border-blue-400 transition">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-blue-800">User Name</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Thông tin cá nhân</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 
