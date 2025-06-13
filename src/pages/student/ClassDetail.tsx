import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { BookOpen, User2, FileText, Users, Info, CheckCircle, XCircle, FileDown, ClipboardList, Award } from "lucide-react";

const classInfo = {
  tenLop: "Lớp Toán 10A",
  tenKhoaHoc: "Toán 10",
  giangVien: "Nguyễn Văn A",
  moTa: "Lớp học Toán nâng cao cho học sinh lớp 10",
  trangThai: true,
};

const materials = [
  { id: 1, tenTaiLieu: "Bài giảng 1", loaiTaiLieu: "PDF", duongDanFile: "bai-giang-1.pdf" },
  { id: 2, tenTaiLieu: "Video bài 2", loaiTaiLieu: "VIDEO", duongDanFile: "video-bai-2.mp4" },
];

const assignments = [
  { id: 1, tenBaiTap: "Bài tập 1", hanNop: "2024-06-20", trangThai: "Chưa nộp" },
  { id: 2, tenBaiTap: "Bài tập 2", hanNop: "2024-06-25", trangThai: "Đã nộp" },
];

const members = [
  { id: 1, hoTen: "Nguyễn Văn A", vaiTro: "Giáo viên" },
  { id: 2, hoTen: "Trần Thị B", vaiTro: "Sinh viên" },
  { id: 3, hoTen: "Lê Văn C", vaiTro: "Sinh viên" },
];

const grade = {
  diem: 8.5,
  tienDo: "80%",
  trangThai: "Hoàn thành tốt"
};

const statusBadge = (active: boolean) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm
      ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
  >
    {/* {active ? (
      <>
        <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Hoạt động
      </>
    ) : (
      <>
        <XCircle className="w-4 h-4 mr-1 text-red-500" /> Khóa
      </>
    )} */}
  </span>
);

const ClassDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Button
          variant="default"
          className="mb-6 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:from-indigo-600 hover:to-blue-700"
          onClick={() => navigate("/student/classes")}
        >
          ← Quay lại danh sách lớp học
        </Button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col gap-4 text-white relative overflow-hidden">
          <div className="flex items-center gap-4 mb-2">
            <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">{classInfo.tenLop}</h1>
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <span className="inline-flex items-center gap-1"><User2 className="w-4 h-4" /> {classInfo.giangVien}</span>
                <span className="inline-flex items-center gap-1"><BookOpen className="w-4 h-4" /> {classInfo.tenKhoaHoc}</span>
                {/* {statusBadge(classInfo.trangThai)} */}
              </div>
            </div>
          </div>
          <div className="text-blue-100 text-base italic">{classInfo.moTa}</div>
        </div>

        {/* Section: Tài liệu */}
        <section className="">
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><FileText className="w-6 h-6 text-blue-500" /> Tài liệu lớp học</h2>
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            {materials.length === 0 ? (
              <div className="text-gray-500 flex items-center gap-2"><Info className="w-5 h-5" /> Chưa có tài liệu.</div>
            ) : (
              <ul className="grid gap-3">
                {materials.map(m => (
                  <li key={m.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${m.loaiTaiLieu === 'PDF' ? 'bg-red-100 text-red-800' : m.loaiTaiLieu === 'VIDEO' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {m.loaiTaiLieu}
                    </span>
                    <span className="font-semibold flex-1">{m.tenTaiLieu}</span>
                    <a href={m.duongDanFile} className="text-blue-600 hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                      <FileDown className="w-4 h-4" /> Tải về
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Section: Bài tập */}
        <section className="">
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><ClipboardList className="w-6 h-6 text-green-500" /> Bài tập</h2>
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            {assignments.length === 0 ? (
              <div className="text-gray-500 flex items-center gap-2"><Info className="w-5 h-5" /> Chưa có bài tập.</div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="text-blue-700">
                    <th className="text-left pb-2">Tên bài tập</th>
                    <th className="text-left pb-2">Hạn nộp</th>
                    <th className="text-left pb-2">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id} className="hover:bg-green-50 transition">
                      <td className="font-semibold py-1">{a.tenBaiTap}</td>
                      <td>{a.hanNop}</td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${a.trangThai === 'Đã nộp' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                          {a.trangThai}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Section: Thành viên */}
        <section className="">
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><Users className="w-6 h-6 text-purple-500" /> Thành viên lớp học</h2>
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            {members.length === 0 ? (
              <div className="text-gray-500 flex items-center gap-2"><Info className="w-5 h-5" /> Chưa có thành viên.</div>
            ) : (
              <ul className="grid gap-2">
                {members.map(m => (
                  <li key={m.id} className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${m.vaiTro === 'Giáo viên' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                      {m.vaiTro}
                    </span>
                    <span className="font-semibold">{m.hoTen}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Section: Bảng điểm */}
        <section className="">
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><Award className="w-6 h-6 text-orange-500" /> Bảng điểm cá nhân</h2>
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-2">
            <div><span className="font-semibold">Điểm:</span> <span className="text-orange-600 font-bold">{grade.diem}</span></div>
            <div><span className="font-semibold">Tiến độ:</span> <span className="text-blue-700 font-semibold">{grade.tienDo}</span></div>
            <div><span className="font-semibold">Trạng thái:</span> <span className="text-green-700 font-semibold">{grade.trangThai}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClassDetail; 