export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 mt-16 border-t border-gray-700">
      <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Cột 1: Logo và mô tả */}
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">LUX FASHION</h2>
          <p className="text-sm leading-7 text-gray-400">
            Cửa hàng thời trang cao cấp mang đến phong cách trẻ trung, hiện đại và tinh tế.
          </p>
        </div>

        {/* Cột 2: nhà phát triển */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Nhà phát triển</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-user text-xs"></i> Trần Huy Sơn
            </li>
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-user text-xs"></i> Trần Đức Thắng
            </li>
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-user text-xs"></i> Nguyễn Minh Sơn
            </li>
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-user text-xs"></i> Phạm Việt Trung
            </li>
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-user text-xs"></i> Nguyễn Văn Quốc Thái
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ khách hàng */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Hỗ trợ khách hàng</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-xs"></i> Chính sách bảo hành
            </li>
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-truck text-xs"></i> Vận chuyển & đổi trả
            </li>
            <li className="hover:text-pink-400 transition-colors duration-200 cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-circle-question text-xs"></i> Câu hỏi thường gặp
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Liên hệ</h3>
          <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-start gap-2 text-gray-400">
              <i className="fa-solid fa-location-dot text-pink-400 mt-1"></i>
              <span>Nguyên Xá, Nam Từ Liêm, Hà Nội</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <i className="fa-solid fa-phone text-pink-400"></i>
              <span>077 4321 353</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <i className="fa-solid fa-envelope text-pink-400"></i>
              <span>support@luxfashion.vn</span>
            </li>
          </ul>

          {/* Mạng xã hội */}
          <div className="mt-6 flex gap-3">
            <a href="https://www.facebook.com/share/1BwfQcHehr/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
              <i className="fab fa-facebook-f text-white"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
              <i className="fab fa-instagram text-white"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
              <i className="fab fa-tiktok text-white"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} <span className="font-semibold text-pink-400">Lux Fashion</span>. All rights reserved.</p>
      </div>
    </footer>
  );
}