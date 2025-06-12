import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, Calendar, FileText, Layers, Star, Users, Info } from "lucide-react";

// Fake data mô phỏng dữ liệu từ database
const fakeCourse = {
  id: 1,
  maMonHoc: "MATH10",
  tenMonHoc: "Toán 10",
  moTa: "Khóa học Toán nâng cao cho học sinh lớp 10.",
  giangVien: { id: 1, hoTen: "Nguyễn Văn A", hinhAnh: "https://ui-avatars.com/api/?name=Nguyen+Van+A" },
  ngayTao: "2024-06-01",
  trangThai: true,
  baiGiang: [
    { id: 1, tenBaiGiang: "Giới thiệu đại số", thuTu: 1, noiDung: "Nội dung bài giảng 1", chuong: [
      { id: 1, tenChuong: "Chương 1: Số học", moTa: "Các khái niệm cơ bản về số học", thuTu: 1 },
      { id: 2, tenChuong: "Chương 2: Đại số", moTa: "Biến và phương trình", thuTu: 2 },
    ] },
    { id: 2, tenBaiGiang: "Hàm số bậc nhất", thuTu: 2, noiDung: "Nội dung bài giảng 2", chuong: [] },
  ],
  thuVienTaiLieu: [
    { id: 1, tenTaiLieu: "Tài liệu chương 1.pdf", loai: "PDF", duongDan: "#", ngayUpload: "2024-06-02" },
    { id: 2, tenTaiLieu: "Slide bài giảng.pptx", loai: "PPT", duongDan: "#", ngayUpload: "2024-06-03" },
  ],
  danhGia: [
    { id: 1, sinhVien: "Trần Thị B", noiDung: "Khóa học rất bổ ích!", ngay: "2024-06-10", diem: 5 },
    { id: 2, sinhVien: "Lê Văn C", noiDung: "Giảng viên dạy dễ hiểu.", ngay: "2024-06-12", diem: 4 },
  ],
  tienDo: [
    { id: 1, sinhVien: "Trần Thị B", hoanThanh: true },
    { id: 2, sinhVien: "Lê Văn C", hoanThanh: false },
  ],
};

const statusBadge = (active: boolean) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
    {active ? "Hoạt động" : "Khóa"}
  </span>
);

const typeBadge = (type: string) => {
  const color =
    type === "PDF"
      ? "bg-red-100 text-red-800"
      : type === "PPT"
      ? "bg-orange-100 text-orange-800"
      : type === "VIDEO"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>{type}</span>
  );
};

const tabs = [
  { key: "info", label: "Thông tin" },
  { key: "lectures", label: "Bài giảng" },
  { key: "materials", label: "Tài liệu" },
  { key: "progress", label: "Tiến độ" },
  { key: "reviews", label: "Đánh giá" },
];

const CourseDetail: React.FC = () => {
  const [tab, setTab] = useState("info");
  const navigate = useNavigate();
  const c = fakeCourse;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6 text-white">
          <BookOpen className="w-16 h-16 text-white drop-shadow-lg" />
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{c.tenMonHoc}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-2"><User className="w-5 h-5" /> {c.giangVien.hoTen}</span>
              <span className="inline-flex items-center gap-2"><Calendar className="w-5 h-5" /> Ngày tạo: {c.ngayTao}</span>
              {statusBadge(c.trangThai)}
            </div>
            <div className="text-blue-100 text-base max-w-2xl">{c.moTa}</div>
          </div>
          <img src={c.giangVien.hinhAnh} alt="GV" className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-blue-100">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`px-5 py-2 font-semibold rounded-t-xl transition-all ${tab === t.key ? "bg-white shadow text-blue-700" : "text-blue-500 hover:bg-blue-100"}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Tab content */}
        {tab === "info" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><Info className="w-6 h-6" /> Thông tin môn học</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-2"><span className="font-semibold text-blue-700">Mã môn học:</span> {c.maMonHoc}</div>
                <div className="mb-2"><span className="font-semibold text-blue-700">Tên môn học:</span> {c.tenMonHoc}</div>
                <div className="mb-2"><span className="font-semibold text-blue-700">Giảng viên:</span> {c.giangVien.hoTen}</div>
                <div className="mb-2"><span className="font-semibold text-blue-700">Ngày tạo:</span> {c.ngayTao}</div>
                {/* <div className="mb-2"><span className="font-semibold text-blue-700">Trạng thái:</span> {statusBadge(c.trangThai)}</div> */}
              </div>
              <div>
                <div className="mb-2"><span className="font-semibold text-blue-700">Mô tả:</span> {c.moTa}</div>
              </div>
            </div>
          </div>
        )}
        {tab === "lectures" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><Layers className="w-6 h-6" /> Danh sách bài giảng & chương</h2>
            {c.baiGiang.length === 0 ? (
              <div className="text-gray-500 flex flex-col items-center py-8"><Info className="w-10 h-10 mb-2 text-gray-300" />Không có bài giảng nào.</div>
            ) : (
              c.baiGiang.map(bg => (
                <div key={bg.id} className="mb-6">
                  <div className="font-bold text-lg text-indigo-700 mb-1 flex items-center gap-2"><FileText className="w-5 h-5" /> {bg.tenBaiGiang} <span className="text-xs text-gray-400">(Thứ tự: {bg.thuTu})</span></div>
                  <div className="text-gray-700 mb-2">{bg.noiDung}</div>
                  {bg.chuong && bg.chuong.length > 0 && (
                    <div className="ml-6">
                      <div className="font-semibold text-blue-600 mb-1">Chương:</div>
                      <ul className="list-disc pl-5">
                        {bg.chuong.map(ch => (
                          <li key={ch.id} className="mb-1"><span className="font-medium text-indigo-700">{ch.tenChuong}</span> <span className="text-gray-500">- {ch.moTa}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        {tab === "materials" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FileText className="w-6 h-6" /> Tài liệu khoá học</h2>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                  <th className="px-4 py-3 text-left font-semibold">Tên tài liệu</th>
                  <th className="px-4 py-3 text-left font-semibold">Loại</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngày upload</th>
                  <th className="px-4 py-3 text-left font-semibold">Tải về</th>
                </tr>
              </thead>
              <tbody>
                {c.thuVienTaiLieu.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500"><Info className="mx-auto h-10 w-10 mb-2 text-gray-300" />Không có tài liệu nào.</td>
                  </tr>
                ) : (
                  c.thuVienTaiLieu.map(tl => (
                    <tr key={tl.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-semibold text-blue-900">{tl.tenTaiLieu}</td>
                      <td className="px-4 py-3">{typeBadge(tl.loai)}</td>
                      <td className="px-4 py-3">{tl.ngayUpload}</td>
                      <td className="px-4 py-3"><a href={tl.duongDan} className="text-blue-600 hover:underline font-semibold" download>Tải về</a></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {tab === "progress" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><Users className="w-6 h-6" /> Tiến độ học tập</h2>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                  <th className="px-4 py-3 text-left font-semibold">Sinh viên</th>
                  <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {c.tienDo.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-gray-500"><Info className="mx-auto h-10 w-10 mb-2 text-gray-300" />Không có dữ liệu.</td>
                  </tr>
                ) : (
                  c.tienDo.map(td => (
                    <tr key={td.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-semibold text-blue-900">{td.sinhVien}</td>
                      <td className="px-4 py-3">{td.hoanThanh ? <span className="text-green-600 font-semibold">Đã hoàn thành</span> : <span className="text-yellow-600 font-semibold">Chưa hoàn thành</span>}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {tab === "reviews" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><Star className="w-6 h-6" /> Đánh giá khoá học</h2>
            {c.danhGia.length === 0 ? (
              <div className="text-gray-500 flex flex-col items-center py-8"><Info className="w-10 h-10 mb-2 text-gray-300" />Chưa có đánh giá nào.</div>
            ) : (
              c.danhGia.map(dg => (
                <div key={dg.id} className="mb-6 border-b border-blue-100 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-blue-900">{dg.sinhVien}</span>
                    <span className="ml-2 flex items-center gap-1 text-yellow-500 font-bold">{Array.from({ length: dg.diem }, (_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}</span>
                  </div>
                  <div className="text-gray-700 italic">"{dg.noiDung}"</div>
                  <div className="text-xs text-gray-400">{dg.ngay}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail; 