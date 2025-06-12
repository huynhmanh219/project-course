import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { BookOpen, User2, Info, CheckCircle, XCircle } from "lucide-react";

const initialClasses = [
  {
    id: 1,
    tenLop: "Lớp Toán 10A",
    tenKhoaHoc: "Toán 10",
    giangVien: "Nguyễn Văn A",
    moTa: "Lớp học Toán nâng cao cho học sinh lớp 10",
    trangThai: true,
  },
  {
    id: 2,
    tenLop: "Lớp Văn 11B",
    tenKhoaHoc: "Ngữ Văn 11",
    giangVien: "Trần Thị B",
    moTa: "Lớp học Văn dành cho học sinh lớp 11",
    trangThai: true,
  },
  {
    id: 3,
    tenLop: "Lớp Lý 12C",
    tenKhoaHoc: "Vật Lý 12",
    giangVien: "Lê Văn C",
    moTa: "Lớp học Vật Lý chuyên sâu lớp 12",
    trangThai: false,
  },
];

const statusBadge = (active: boolean) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm
      ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
  >
    {active ? (
      <>
        <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động
      </>
    ) : (
      <>
        <XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa
      </>
    )}
  </span>
);

const StudentClasses: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" /> Danh sách lớp học
            </h1>
            <p className="text-gray-500 text-base">Các lớp học bạn có thể tham gia hoặc đang học.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialClasses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Info className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              Không có lớp học nào đang mở.
            </div>
          ) : (
            initialClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-shadow duration-200 flex flex-col p-6 group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-2 shadow">
                    <BookOpen className="text-white w-6 h-6" />
                  </span>
                  <span className="font-bold text-lg text-blue-900 truncate flex-1">{cls.tenLop}</span>
                  {statusBadge(cls.trangThai)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User2 className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{cls.giangVien}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>{cls.tenKhoaHoc}</span>
                </div>
                <div className="mb-3 text-gray-700 text-sm line-clamp-2 min-h-[36px]">
                  {cls.moTa}
                </div>
                <Button
                  variant="default"
                  className="mt-auto w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold shadow-lg py-2 rounded-xl text-base group-hover:scale-105 transition-transform"
                  onClick={() => navigate(`/student/classes/${cls.id}`)}
                  disabled={!cls.trangThai}
                >
                  {cls.trangThai ? "Vào lớp" : "Lớp đã khoá"}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentClasses; 