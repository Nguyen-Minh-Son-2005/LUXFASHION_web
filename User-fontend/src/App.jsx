import './App.css';
import Home from './pages/home';
import Header from './components/header';
import Footer from './components/footer';
import GioiThieu from './pages/goithieu';
import SanPham from './pages/sanpham';

import Sale from './pages/sale';
import Hang from './pages/hang';
import ThongTinKhachHang from './pages/thongtinkhachhang';
import GioHang from "./pages/giohang";
import TaiKhoan from "./pages/taikhoan";
import ChiTietSP from "./pages/chitietsp";
import DangKy from "./pages/dangky";
import DonHang from "./pages/donhang";
import ThongTinDonHang from "./pages/thongtindonhang";
import ChiTietDonHang from "./pages/chitietdonhang";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [userId, setUserId] = useState(null);

  // ✅ Load userId từ localStorage khi App mount
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        
        // Kiểm tra cấu trúc dữ liệu trước khi truy cập
        if (parsed?.data?.id) {
          setUserId(parsed.data.id);
          console.log("✅ App.jsx load userId:", parsed.data.id);
        } else if (parsed?.id) {
          // Trường hợp data không có nested "data"
          setUserId(parsed.id);
          console.log("✅ App.jsx load userId:", parsed.id);
        } else {
          console.warn("⚠️ User data không có id, xóa localStorage");
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error("❌ Lỗi khi load user từ localStorage:", err);
      // Xóa dữ liệu lỗi
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <>
      <Router>
        {/* ✅ FIX: Truyền setUserId xuống Header */}
        <Header userId={userId} setUserId={setUserId} />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gioithieu" element={<GioiThieu />} />
          <Route path="/sanpham" element={<SanPham />} />
          
          <Route path="/sale" element={<Sale />} />
          <Route path="/hang" element={<Hang />} />
          <Route path="/thongtinkhachhang" element={<ThongTinKhachHang />} />
          
          {/* Các trang từ nút riêng trong Header */}
          <Route path="/giohang" element={<GioHang userId={userId} />} />
          <Route path="/taikhoan" element={<TaiKhoan setUserId={setUserId} />} />
          <Route path="/dangky" element={<DangKy />} />
          <Route path="/chitietsp/:id" element={<ChiTietSP userId={userId} />} />
          <Route path="/donhang" element={<DonHang userId={userId} />} />
          <Route path="/thongtindonhang" element={<ThongTinDonHang userId={userId} />} />
          <Route path="/chitietdonhang/:id" element={<ChiTietDonHang userId={userId} />} />
        </Routes>
      </Router>
      
      <Footer />
    </>
  );
}

export default App;