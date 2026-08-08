import QuangCao from'../components/quangcao';
import ProductSection from '../components/dsspnoibat';
function Home() {
  return (
    <>
    <QuangCao />
   <section className="my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Sản phẩm nổi bật</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Khám phá những sản phẩm được yêu thích nhất</p>
        </div>
        <ProductSection apiUrl="/api/products/featured" />
      </section>

    </>
  );
}

export default Home;