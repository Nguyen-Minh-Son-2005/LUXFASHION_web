import { Link } from "react-router-dom";
import logo from "../assets/logochinh.png";

export default function AdminHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          {/* Logo + tên web */}
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-emerald-400/40 via-sky-400/30 to-violet-500/40 blur-md opacity-70 group-hover:opacity-100 transition" />
              <div className="relative rounded-2xl bg-slate-950/80 border border-slate-700/80 p-1.5">
                <img
                  src={logo}
                  alt="logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-3xl uppercase tracking-[0.5em] bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
                LuxFashion
              </span>
              <span className="text-sm font-semibold text-slate-50">
                Nâng tầm cuộc chơi 
              </span>
            </div>
          </Link>

          {/* Tên admin / tiêu đề */}
          <div className="flex-1 flex justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <span className="text-xs md:text-sm font-medium bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
                Khu vực quản trị hệ thống
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}