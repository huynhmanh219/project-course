import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t mt-8 py-4 px-4 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm shadow-sm">
      <div className="font-semibold text-blue-700">Hệ thống Quản lý Học tập</div>
      <div className="mt-2 md:mt-0">&copy; {new Date().getFullYear()} MyCourse. All rights reserved.</div>
      <div className="mt-2 md:mt-0">
        Liên hệ: <a href="mailto:support@mycourse.edu" className="text-blue-600 hover:underline">support@mycourse.edu</a>
      </div>
    </footer>
  );
};

export default Footer; 