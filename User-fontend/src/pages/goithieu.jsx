import { Link } from "react-router-dom";

export default function GioiThieu() {
  const teamMembers = [
    { name: "Trần Huy Sơn" },
    { name: "Trần Đức Thắng" },
    { name: "Nguyễn Minh Sơn" },
    { name: "Phạm Việt Trung" },
    { name: "Nguyễn Văn Quốc Thái" },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            Chào mừng đến với LUX-FASHION
          </h1>
          <p className="text-2xl font-light italic mb-8">
            Nơi Phong Cách Lên Ngôi!
          </p>
          <div className="w-24 h-1 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Giới thiệu chung */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Chúng tôi là nhóm 5 sinh viên Ngành Kỹ Thuật Phần Mềm - Đại Học Công Nghiệp 
            với mong muốn đem đến cho mọi người những bộ quần áo, phụ kiện chất lượng và 
            giá cả hợp lý. Chúng tôi đã tạo nên trang web này với niềm đam mê và sự tận tâm.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Đến với web của chúng tôi, bạn sẽ được trải nghiệm:
          </p>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ValueCard
            icon="✨"
            title="Phong Cách Dễ Dàng"
            description="Chúng tôi tin rằng thời trang phải dễ tiếp cận với mọi người, không cần phải đắt đỏ hay quá phức tạp."
          />
          <ValueCard
            icon="🏆"
            title="Chất Lượng và Sự Tận Tâm"
            description="Mỗi sản phẩm được chọn lọc/thiết kế đều đảm bảo về chất lượng, đi kèm với dịch vụ chăm sóc khách hàng chuyên nghiệp."
          />
          <ValueCard
            icon="💎"
            title="Cộng Đồng và Tính Cá Nhân"
            description="Chúng tôi khuyến khích bạn thể hiện cá tính riêng, không theo bất kỳ khuôn mẫu nào, và xây dựng một cộng đồng yêu thời trang tích cực."
          />
          <ValueCard
            icon="🤝"
            title="Đội Ngũ Nhân Viên"
            description="Chu đáo và tin cậy, sẵn sàng phục vụ mỗi khi phát sinh tình huống."
          />
        </div>
      </section>

      {/* Đội ngũ sáng lập */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Đội Ngũ Sáng Lập
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} name={member.name} />
          ))}
        </div>
      </section>

      {/* Lời kết */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Lời Kết</h3>
          <p className="text-lg leading-relaxed mb-8 italic">
            "Mỗi người trong chúng tôi mang một chuyên môn khác nhau, nhưng tất cả đều hợp lại 
            vì mục tiêu chung là tạo ra một nền tảng thời trang <strong>hoàn thiện và thân thiện nhất</strong> cho bạn."
          </p>
          <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl font-semibold">
            Chúng tôi không ngừng cập nhật và cải tiến. Trong tương lai, LUX-FASHION 
            đặt mục tiêu trở thành trang web top 1 về thời trang.
          </p>
          <p className="text-lg mt-4">
            ✨ Hãy đồng hành cùng chúng tôi trên chặng đường ấy! ✨
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">
          Sẵn sàng khám phá phong cách của bạn?
        </h3>
        <Link
          to="/home"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
        >
          Khám Phá Ngay
        </Link>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TeamMemberCard({ name }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition transform hover:-translate-y-2">
      {/* Placeholder cho ảnh đại diện */}
      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
        {name.charAt(0)}
      </div>
      <h4 className="text-xl font-bold text-gray-800">{name}</h4>
    </div>
  );
}