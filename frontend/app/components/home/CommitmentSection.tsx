"use client";

import Image from "next/image";

const commitments = [
  {
    img: "/cake.jpg",
    title: "Nguyên liệu tươi mới",
    subtitle: "CHỌN LỌC KỸ LƯỠNG",
    desc: "Witchy Bakery cam kết sử dụng nguyên liệu tươi mỗi ngày, được chọn lọc kỹ lưỡng để đảm bảo chất lượng và hương vị tự nhiên trong từng chiếc bánh.",
  },
  {
    img: "/cake1.jpg",
    title: "An toàn & tự nhiên",
    subtitle: "KHÔNG CHẤT BẢO QUẢN",
    desc: "Chúng tôi ưu tiên nguyên liệu tự nhiên, hạn chế phụ gia và không sử dụng chất bảo quản, mang đến sự an tâm cho sức khỏe của bạn.",
  },
  {
    img: "/cake2.jpg",
    title: "Làm bánh với sự tận tâm",
    subtitle: "TỪNG CHI TIẾT NHỎ",
    desc: "Mỗi chiếc bánh đều được làm thủ công với sự tỉ mỉ và đam mê, gửi gắm trọn vẹn yêu thương trong từng sản phẩm.",
  },
];

export default function CommitmentSectionPage() {
  return (
    <section className="bg-[#f3efe9] py-20 px-6">
      
      {/* TITLE */}
      <h2 className="text-center text-xl font-serif tracking-widest text-[#1c1a17] mb-16">
        WITCHY BAKERY VỚI SỰ TIN TƯỞNG NGƯỜI DÙNG
        <p> CHÚNG TÔI LUÔN ĐẢM BẢO</p>
      </h2>
      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        
        {commitments.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            
            {/* ICON */}
            <div className="w-24 h-24 relative mb-6">
              <Image
                src={item.img}
                alt=""
                fill
                className="object-contain"
              />
            </div>

            {/* TITLE */}
            <h3 className="text-xl font-serif text-gray-800 mb-2">
              {item.title}
            </h3>

            {/* SUBTITLE */}
            <p className="text-xs tracking-widest text-gray-500 mb-4">
              {item.subtitle}
            </p>

            {/* DESC */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              {item.desc}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
}