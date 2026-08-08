import { useState, useEffect } from "react";

// 🖼️ import ảnh (đổi thành ảnh của bạn)
import img1 from "../assets/qc2.jpg";
import img2 from "../assets/qc1.jpg";
import img3 from "../assets/qc3.png";
import img4 from "../assets/qc4.png";
import img5 from "../assets/qc5.png";
function Slider() {
  const images = [img1, img2, img3,img4,img5];
  const [currentIndex, setCurrentIndex] = useState(0);

  //  Tự động đổi ảnh mỗi 2 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);//% là khi đến ảnh cuối chia% là băng 0 quay lại ảnh 1
    }, 3000);

    return () => clearInterval(timer); // Dọn dẹp khi unmount
  }, [images.length]);

  // 👉 Ảnh kế tiếp
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // 👈 Ảnh trước
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-7xl h-[550px] overflow-hidden z-0 mx-auto mt-4 rounded-2xl shadow-2xl">
  {/* Khối chứa ảnh trượt ngang */}
  <div
    className="flex w-full h-full transition-transform duration-700 ease-in-out"
    style={{
      transform: `translateX(-${currentIndex * 100}%)`
    }}
  >
    {images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`Slide ${index}`}
        className="w-full h-full object-cover flex-shrink-0"
      />
    ))}
  </div>

      {/* Nút trái */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-3xl text-gray-800 px-4 py-2 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-gray-200"
        aria-label="Previous slide"
      >
        &lt;
      </button>

      {/* Nút phải */}
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-3xl text-gray-800 px-4 py-2 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-gray-200"
        aria-label="Next slide"
      >
        &gt;
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;