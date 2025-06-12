import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    setLoading(true);
    // TODO: Gọi API đổi mật khẩu ở đây
    setTimeout(() => {
      setLoading(false);
      setSuccess("Đổi mật khẩu thành công!");
      setTimeout(() => navigate("/student/profile"), 1200);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Đổi mật khẩu</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex gap-3 mt-8">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button type="button" variant="default" onClick={() => navigate("/student/profile")}>Huỷ</Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword; 