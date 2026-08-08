import ProductSection from '../components/dsspnoibat';
function Sale() {
  return (
    <section className="my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block mb-4">
          <span className="text-5xl font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            SẢN PHẨM KHUYẾN MÃI
          </span>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-2"></div>
        <p className="text-gray-600 mt-4 text-lg">Những ưu đãi hấp dẫn đang chờ bạn</p>
      </div>
      <ProductSection apiUrl="/api/products/featured" soluonghien={16}/>
    </section>
  );
}

export default Sale;