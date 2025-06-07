import React from "react";
import { useNavigate } from "react-router-dom";

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

const ClassDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        onClick={() => navigate("/student/classes")}
      >
        ← Quay lại danh sách lớp học
      </button>

      {/* Section: Thông tin lớp học */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Thông tin lớp học</h1>
        <div className="bg-white p-4 rounded shadow">
          <div><span className="font-semibold">Tên lớp:</span> {classInfo.tenLop}</div>
          <div><span className="font-semibold">Khóa học:</span> {classInfo.tenKhoaHoc}</div>
          <div><span className="font-semibold">Giảng viên:</span> {classInfo.giangVien}</div>
          <div><span className="font-semibold">Mô tả:</span> {classInfo.moTa}</div>
          <div><span className="font-semibold">Trạng thái:</span> {classInfo.trangThai ? <span className="text-green-600 font-semibold">Hoạt động</span> : <span className="text-red-500">Khóa</span>}</div>
        </div>
      </section>

      {/* Section: Tài liệu */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Tài liệu lớp học</h2>
        <div className="bg-white p-4 rounded shadow">
          {materials.length === 0 ? (
            <div className="text-gray-500">Chưa có tài liệu.</div>
          ) : (
            <ul className="list-disc pl-5">
              {materials.map(m => (
                <li key={m.id} className="mb-1">
                  <span className="font-semibold">{m.tenTaiLieu}</span> ({m.loaiTaiLieu}) -
                  <a href={m.duongDanFile} className="text-blue-600 underline ml-1" target="_blank" rel="noopener noreferrer">Tải về</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Section: Bài tập */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Bài tập</h2>
        <div className="bg-white p-4 rounded shadow">
          {assignments.length === 0 ? (
            <div className="text-gray-500">Chưa có bài tập.</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Tên bài tập</th>
                  <th className="text-left">Hạn nộp</th>
                  <th className="text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id}>
                    <td>{a.tenBaiTap}</td>
                    <td>{a.hanNop}</td>
                    <td>{a.trangThai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Section: Thành viên */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Thành viên lớp học</h2>
        <div className="bg-white p-4 rounded shadow">
          {members.length === 0 ? (
            <div className="text-gray-500">Chưa có thành viên.</div>
          ) : (
            <ul className="list-disc pl-5">
              {members.map(m => (
                <li key={m.id}>
                  {m.hoTen} <span className="text-gray-500">({m.vaiTro})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Section: Bảng điểm */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Bảng điểm cá nhân</h2>
        <div className="bg-white p-4 rounded shadow">
          <div><span className="font-semibold">Điểm:</span> {grade.diem}</div>
          <div><span className="font-semibold">Tiến độ:</span> {grade.tienDo}</div>
          <div><span className="font-semibold">Trạng thái:</span> {grade.trangThai}</div>
        </div>
      </section>
    </div>
  );
};

export default ClassDetail; 