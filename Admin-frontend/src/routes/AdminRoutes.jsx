import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/AdminLogin";

import AdminLayout from "../components/Layout/AdminLayout";
import AdminHome from "../pages/AdminHome";
import ProductsPage from "../pages/ProductsPage";
import OrdersPage from "../pages/OrdersPage";
import PromotionsPage from "../pages/PromotionsPage";
import NewsPage from "../pages/NewsPage";
import CustomersPage from "../pages/CustomersPage";
import SuppliersPage from "../pages/SuppliersPage";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Trang login */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Nếu chưa login → chuyển luôn về login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Các trang admin cần login */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
      </Route>
    </Routes>
  );
}