// src/pages/CustomersPage.jsx
import { useState, useEffect } from "react";
import { Search, User, Mail, Phone, MapPin } from "lucide-react";
import { getCustomers } from "../services/customerService";
import Pagination from "../components/Pagination";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("email");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. TẢI DỮ LIỆU TỪ API THỰC
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      // Dựa vào ảnh JSON: response có dạng { statusCode: 200, data: [...] }
      // Service của bạn trả về response.data, nên ở đây ta lấy .data tiếp để ra mảng
      const list = response.data || []; 
      
      setCustomers(list);
    } catch (error) {
      console.error("Lỗi tải data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIC TÌM KIẾM (Đã cập nhật tên biến mới)
  useEffect(() => {
    let result = [...customers];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((c) => {
        if (searchType === "email") return c.email?.toLowerCase().includes(lowerTerm);
        if (searchType === "name") return c.fullName?.toLowerCase().includes(lowerTerm) || c.username?.toLowerCase().includes(lowerTerm);
        // ⚠️ SỬA: Đổi phone -> phoneNumber
        if (searchType === "phone") return c.phoneNumber?.includes(lowerTerm);
        if (searchType === "id") return c.id?.toString().includes(lowerTerm);
        return false;
      });
    }

    const totalPages = Math.ceil(result.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    setDisplayedCustomers(result.slice(startIndex, startIndex + itemsPerPage));
  }, [customers, searchTerm, searchType, currentPage]);

  return (
    <div className="min-h-[70vh] flex flex-col space-y-5">
      {/* HEADER: TIÊU ĐỀ + SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            Quản lí người dùng
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tra cứu nhanh khách hàng theo email, tên, số điện thoại hoặc mã user.
          </p>
        </div>

        <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm w-full md:w-[380px]">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Nhập ${searchType === 'email' ? 'email' : searchType === 'phone' ? 'SĐT' : searchType === 'id' ? 'mã user' : 'tên'}...`}
              className="w-full py-2.5 pl-10 pr-3 outline-none text-sm bg-transparent text-slate-50 placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          </div>
          
          <div className="border-l border-slate-800 bg-slate-900/70">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="py-2.5 px-3 bg-transparent outline-none text-xs md:text-sm font-medium text-slate-200 cursor-pointer hover:bg-slate-800"
            >
              <option value="email">Email</option>
              <option value="name">Tên</option>
              <option value="phone">SĐT</option>
              <option value="id">Mã User</option>
            </select>
          </div>
        </div>
      </div>

      {/* DANH SÁCH KHÁCH HÀNG */}
      <div className="flex-1 space-y-4">
        {loading ? (
          <p className="text-center text-slate-400">Đang tải dữ liệu...</p>
        ) : displayedCustomers.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 text-slate-400 text-sm">
            Không tìm thấy khách hàng nào.
          </div>
        ) : (
          displayedCustomers.map((user) => (
            <div 
              key={user.id} 
              className="border border-slate-800 rounded-2xl p-4 flex gap-6 hover:border-slate-600 hover:bg-slate-900/60 transition bg-slate-950/50 items-center group shadow-sm"
            >
              {/* KHỐI TRÁI: Mã User */}
              <div className="w-24 h-24 bg-sky-950/40 rounded-2xl flex flex-col items-center justify-center text-sky-300 border border-sky-800/60 shrink-0">
                <span className="text-[10px] font-semibold uppercase text-sky-400 mb-1 tracking-wide">
                  Mã User
                </span>
                <span className="text-3xl font-bold text-sky-200">#{user.id}</span>
              </div>

              {/* KHỐI PHẢI: Thông tin chi tiết */}
              <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {/* Hàng 1: Username & Role */}
                <div className="col-span-2 mb-1 border-b border-slate-800 pb-2 flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 text-[11px] uppercase font-semibold mr-2 tracking-wide">
                      Tên tài khoản:
                    </span>
                    <span className="font-semibold text-slate-50 text-lg">
                      {user.username}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                    user.roleName === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/40'
                  }`}>
                    {user.roleName}
                  </span>
                </div>

                {/* Cột trái */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-200">
                    <User size={16} className="text-slate-400" />
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={16} className="text-slate-500" />
                    <span>{user.email}</span>
                  </div>
                </div>

                {/* Cột phải */}
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-slate-300">
                    <Phone size={16} className="text-slate-500" />
                    <span>{user.phoneNumber || "---"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={16} className="text-slate-500" />
                    <span className="truncate max-w-[220px]" title={user.address}>
                      {user.address || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PHÂN TRANG */}
      <div className="mt-4 flex justify-center border-t border-slate-800 pt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(customers.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}