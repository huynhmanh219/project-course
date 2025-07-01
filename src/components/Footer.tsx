import React from "react";
import { Mail, Copyright } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-t border-blue-100 py-6 px-4 flex flex-col md:flex-row items-center justify-between text-gray-700 text-sm shadow-sm gap-2 relative z-0">
      <div className="flex items-center gap-2 font-bold text-blue-700 text-base">
        <Copyright className="w-4 h-4" />
        <span>Hệ thống Quản lý Học tập</span>
      </div>
      <div className="mt-2 md:mt-0 text-gray-500">&copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700">LMS</span>. All rights reserved.</div>
      <div className="mt-2 md:mt-0 flex items-center gap-2">
        <Mail className="w-4 h-4 text-blue-500" />
        <span>Liên hệ:</span>
        <a href="mailto:support@lms.edu" className="text-blue-600 hover:underline font-medium">Hỗ trợ @lms.com</a>
      </div>
    </footer>
  );
};

export default Footer; 