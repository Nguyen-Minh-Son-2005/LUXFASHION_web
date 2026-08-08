import { useState } from "react";
import api from "../services/api";
import logo from "../assets/logochinh.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      const user = res.data.data;
      const isAdmin =
        typeof user.roleName === "string" &&
        user.roleName.toUpperCase().includes("ADMIN");

      if (isAdmin) {
        localStorage.setItem("admin", JSON.stringify(user));
        window.location.href = "/admin";
      } else {
        setError("Tài khoản không có quyền Admin!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left intro */}
        <div className="hidden md:flex flex-col gap-4 text-slate-100">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            Bảng điều khiển dành cho quản trị viên
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
            LuxFashion
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-slate-400 text-sm lg:text-base">
            Quản lý đơn hàng, sản phẩm, khuyến mãi và khách hàng trong một giao
            diện tinh gọn, hiện đại.
          </p>
        </div>

        {/* Right card */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-4xl bg-linear-to-tr from-emerald-500/40 via-sky-500/30 to-violet-500/40 blur-2xl opacity-70" />
          <div className="relative bg-slate-950/80 border border-slate-800 rounded-[28px] shadow-[0_24px_80px_rgba(15,23,42,1)] px-6 py-7 sm:px-8 sm:py-8 backdrop-blur-2xl">
            <div className="flex flex-col items-center mb-6 gap-2">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="LuxFashion" className="h-10 w-auto object-contain" />
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Đăng nhập hệ thống
                </p>
                <h2 className="text-lg font-semibold text-slate-50 mt-1">
                  LuxFashion Admin
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-rose-400 text-xs font-medium mt-1">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-linear-to-r from-sky-500 via-emerald-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(59,130,246,0.55)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}