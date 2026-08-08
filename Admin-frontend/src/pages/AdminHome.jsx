import Sidebar from "../components/Sidebar";
import NavButton from "../components/NavButton";
import { ShoppingCart, Tag, Newspaper, Users, Truck } from "lucide-react";


export default function AdminHome() {
    const rightButtons = [
        { label: "Đơn hàng", icon: ShoppingCart, to: "/orders" },
        { label: "Kho khuyến mãi", icon: Tag, to: "/promotions" },
        { label: "Tin tức", icon: Newspaper, to: "/news" },
        { label: "Tài khoản", icon: Users, to: "/customers" },
        { label: "Nhà cung cấp", icon: Truck, to: "/suppliers" },
    ];
  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Khu vực nội dung bên phải */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-1">
            Bảng điều khiển
          </h1>
          <p className="text-sm text-slate-400">
            Chọn khu vực quản lý để bắt đầu làm việc với hệ thống.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rightButtons.map((btn) => (
            <NavButton key={btn.label} {...btn} />
          ))}
        </div>
      </div>
    </div>
  );
}