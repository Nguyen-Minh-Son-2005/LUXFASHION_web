// src/components/Layout/AdminLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("admin"));

  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("admin");
      if (!user) {
        setIsAdmin(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <AdminHeader />
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.8)] p-4 md:p-6 backdrop-blur-xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}