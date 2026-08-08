import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HaGioHang from "../assets/logogiohang.jpeg";
import Logosv from "../assets/logosv.png";
import FilterModal from "../components/cp-loc";

function Logo() {
  return (
    <Link to="/home" className="hover:opacity-90 transition-opacity duration-300">
      <img src={Logosv} alt="ha" className="w-60 h-20 object-contain" />
    </Link>
  );
}

function Menu() {
  const [showMenu, setShowMenu] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showBrands, setShowBrands] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/suppliers");
        if (!res.ok) {
          throw new Error("Không thể tải danh sách hãng");
        }
        const result = await res.json();
        const supplierList = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];
        setBrands(supplierList);
      } catch (err) {
        console.error("Lỗi tải suppliers:", err);
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  const categories = {
    "Áo": [
      { id: 1, name: "Áo thun" },
      { id: 2, name: "Áo sơ mi" },
      { id: 3, name: "Áo len" },
      { id: 4, name: "Áo khoác" },
      { id: 5, name: "Áo hoodie" },
      { id: 6, name: "Áo vest" },
      { id: 7, name: "Áo dài" },
    ],
    "Găng tay": [
      { id: 8, name: "Găng tay da" },
      { id: 9, name: "Găng tay len" },
      { id: 10, name: "Găng tay vải" },
    ],
    "Giày & Dép": [
      { id: 11, name: "Giày sneaker" },
      { id: 12, name: "Giày thể thao" },
      { id: 13, name: "Giày da" },
      { id: 14, name: "Bốt" },
      { id: 15, name: "Dép quai hậu" },
    ],
    "Phụ kiện": [
      { id: 16, name: "Mũ lưỡi trai" },
      { id: 17, name: "Mũ tròn" },
      { id: 18, name: "Mũ bucket" },
      { id: 19, name: "Mũ len" },
      { id: 30, name: "Balo" },
    ],
    "Quần & Váy": [
      { id: 20, name: "Quần short" },
      { id: 21, name: "Quần jean" },
      { id: 22, name: "Quần dài vải" },
      { id: 23, name: "Váy" },
    ],
    "Trang sức & Túi": [
      { id: 24, name: "Kính" },
      { id: 25, name: "Nơ" },
      { id: 26, name: "Cà vạt" },
      { id: 27, name: "Tất" },
      { id: 28, name: "Túi xách tay" },
      { id: 29, name: "Túi đeo ngang hông" },
    ],
  };

  return (
    <nav>
      <ul className="flex list-none gap-5 font-semibold items-center">
        <li>
          <Link className="text-white hover:text-blue-200 transition-colors duration-200 py-2 px-2 whitespace-nowrap" to="/gioithieu">
            Giới thiệu
          </Link>
        </li>
        <li
          className="relative"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <Link className="text-white hover:text-blue-200 transition-colors duration-200 py-2 px-2 whitespace-nowrap" to="/sanpham">
            Sản phẩm
          </Link>
          {showMenu && (
            <div className="absolute left-0 mt-2 w-[800px] bg-white text-black shadow-xl p-6 rounded-xl grid grid-cols-3 gap-6 z-50 border border-gray-200">
              {Object.entries(categories).map(([group, items]) => (
                <div key={group}>
                  <h4 className="font-bold text-base mb-3 border-b-2 border-indigo-200 pb-2 text-indigo-700">{group}</h4>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="py-2 px-3 text-sm hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer rounded-md transition-all duration-200 font-medium"
                        onClick={() => navigate(`/sanpham?categoryId=${item.id}`)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </li>
       
        <li>
          <Link className="text-white hover:text-blue-200 transition-colors duration-200 py-2 px-2 relative whitespace-nowrap" to="/sale">
            Sale
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">HOT</span>
          </Link>
        </li>
        <li
          className="relative"
          onMouseEnter={() => setShowBrands(true)}
          onMouseLeave={() => setShowBrands(false)}
        >
          <span className="cursor-pointer text-white hover:text-blue-200 transition-colors duration-200 py-2 px-2 whitespace-nowrap">Hãng</span>
          {showBrands && (
            <div className="absolute left-0 mt-2 bg-white shadow-xl rounded-xl p-5 z-50 grid grid-cols-3 gap-3 w-[600px] max-h-[300px] overflow-y-auto border border-gray-200">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => {
                    navigate(`/sanpham?supplierIds=${brand.id}`);
                    setShowBrands(false);
                  }}
                  className="text-gray-700 hover:text-indigo-600 cursor-pointer font-medium hover:bg-indigo-50 px-3 py-2.5 rounded-lg transition-all duration-200 border border-transparent hover:border-indigo-200"
                >
                  {brand.name}
                </div>
              ))}
            </div>
          )}
        </li>
        <li>
          <Link className="text-white hover:text-blue-200 transition-colors duration-200 py-2 px-2 leading-tight" to="/thongtinkhachhang">
            <span className="block">Thông tin</span>
            <span className="block">khách hàng</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function NutLoc() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="text-sm font-semibold px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-lg hover:bg-white/30 transition-all duration-200 text-white cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
        onClick={() => setOpen(true)}
      >
        <i className="fa-solid fa-filter mr-2"></i>Lọc
      </button>
      <FilterModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

function TimKiem() {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");
        const data = await res.json();
        const rawList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        const mapped = rawList.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.imageUrl || p.images?.[0] || "",
          price: p.salePrice ?? p.price ?? p.originalPrice ?? 0,
        }));
        setAllProducts(mapped);
      } catch (err) {
        console.error("Lỗi tải sản phẩm tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const keyword = searchTerm.toLowerCase();
    const matches = allProducts.filter((p) =>
      (p.name || "").toLowerCase().includes(keyword)
    );
    setFilteredProducts(matches.slice(0, 8));
  }, [searchTerm, allProducts]);

  const formatVND = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleSelect = (id) => {
    setSearchTerm("");
    setFilteredProducts([]);
    navigate(`/chitietsp/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filteredProducts[0]) {
      handleSelect(filteredProducts[0].id);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={loading ? "Đang tải sản phẩm..." : "Tìm kiếm sản phẩm..."}
          className="pl-10 pr-4 py-2 text-sm w-56 text-gray-900 bg-white/95 backdrop-blur-sm border border-white/30 shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
        />
      </form>

      {searchTerm && (
        <div className="absolute mt-2 w-72 bg-white shadow-2xl rounded-lg border border-gray-100 max-h-80 overflow-y-auto z-50">
          {filteredProducts.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">
              {loading ? "Đang tải..." : "Không tìm thấy sản phẩm phù hợp"}
            </div>
          ) : (
            filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-indigo-50 transition-colors"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs border">
                    No img
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {p.name}
                  </div>
                  <div className="text-xs text-indigo-600 font-bold">
                    {formatVND(p.price)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function GioHang({ userId }) {
  return (
    <Link
      className="text-white hover:text-blue-200 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-2 shadow-lg rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      to={userId ? "/giohang" : "/taikhoan"}
    >
      <i className="fa-solid fa-cart-shopping"></i>
      <span className="text-sm font-semibold whitespace-nowrap">Giỏ hàng</span>
    </Link>
  );
}

function DonHang({ userId }) {
  return (
    <Link
      className="text-white hover:text-blue-200 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-2 shadow-lg rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      to={userId ? "/thongtindonhang" : "/taikhoan"}
    >
      <i className="fa-solid fa-receipt"></i>
      <span className="text-sm font-semibold whitespace-nowrap">Đơn hàng</span>
    </Link>
  );
}

function TaiKhoan({ userId, setUserId }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserId(null);
    navigate("/home");
  };

  return userId ? (
    <button
      onClick={handleLogout}
      className="text-white bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 shadow-lg rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-semibold whitespace-nowrap"
    >
      Đăng xuất
    </button>
  ) : (
    <Link
      className="text-white hover:text-blue-200 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 shadow-lg rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-semibold whitespace-nowrap"
      to="/taikhoan"
    >
      Đăng nhập
    </Link>
  );
}

export default function Header({ userId, setUserId }) {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-xl sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between py-4 px-4">
        <Logo />
        <Menu />
        <div className="flex items-center gap-3">
          <NutLoc />
          <TimKiem />
          <GioHang userId={userId} />
          <DonHang userId={userId} />
          <TaiKhoan userId={userId} setUserId={setUserId} />
        </div>
      </div>
    </header>
  );
}
