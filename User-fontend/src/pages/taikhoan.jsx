import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUserId }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.error || "Sai email hoặc mật khẩu!");
      }

      const userData = data?.data ?? data;
      if (!userData?.id) {
        setError("Phản hồi đăng nhập không hợp lệ!");
        return;
      }

      // 🔹 Lưu user vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUserId(userData.id);

      // 🔹 Chuyển về trang chủ hoặc trang trước đó
      navigate("/");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full mb-4">
            <i className="fa-solid fa-user text-white text-3xl"></i>
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Đăng nhập
          </h2>
          <p className="text-gray-600">Chào mừng bạn Đến với Web !</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <i className="fa-solid fa-envelope mr-2 text-indigo-500"></i>Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <i className="fa-solid fa-lock mr-2 text-indigo-500"></i>Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-right-to-bracket mr-2"></i>Đăng nhập
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <a href="/dangky" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
