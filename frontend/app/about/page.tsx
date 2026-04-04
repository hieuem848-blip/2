"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-[#f7f4ef] min-h-screen">

      {/* HERO */}
      <section className="relative h-[260px] md:h-[320px]">
        <Image
          src="/cakebg.png"
          alt="Về Witchy Bakery"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <p className="text-xs tracking-[0.3em] mb-3">Witchy Bakery</p>
          <h1 className="text-3xl md:text-5xl font-bold">
            Về chúng tôi
          </h1>
          <p className="mt-3 text-sm opacity-80 max-w-md">
            Nơi những chiếc bánh không chỉ ngon mà còn mang câu chuyện
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Câu chuyện của Witchy Bakery
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Witchy Bakery được sinh ra từ niềm đam mê với bánh ngọt và mong muốn
          mang đến những trải nghiệm ngọt ngào nhất cho khách hàng.  
          Mỗi chiếc bánh là sự kết hợp giữa nguyên liệu tươi mới, kỹ thuật thủ công
          và sự sáng tạo không giới hạn.
        </p>
      </section>

      {/* STORY + IMAGE */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10 items-center">
        
        <div className="relative h-[300px] rounded-2xl overflow-hidden">
          <Image src="/cake1.jpg" alt="" fill className="object-cover" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Hành trình phát triển
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Từ một tiệm bánh nhỏ, Witchy Bakery đã dần phát triển thành nơi được
            nhiều khách hàng tin tưởng.  
            Chúng tôi luôn giữ vững giá trị cốt lõi: chất lượng – tinh tế – sáng tạo.
          </p>
        </div>

      </section>

      {/* VALUES (UPDATED) */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-10">
            Giá trị của chúng tôi
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <div className="text-3xl mb-3">💛</div>
              <h4 className="font-semibold mb-2">Quan tâm</h4>
              <p className="text-sm text-gray-500">
                Chúng tôi luôn lắng nghe và đặt cảm xúc của khách hàng lên hàng đầu.
              </p>
            </div>

            <div>
              <div className="text-3xl mb-3">🎂</div>
              <h4 className="font-semibold mb-2">Thủ công</h4>
              <p className="text-sm text-gray-500">
                Mỗi chiếc bánh được làm bằng tay với sự tỉ mỉ và tâm huyết.
              </p>
            </div>

            <div>
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-semibold mb-2">Cảm hứng</h4>
              <p className="text-sm text-gray-500">
                Mang đến sự sáng tạo và cảm hứng trong từng thiết kế bánh.
              </p>
            </div>

            <div>
              <div className="text-3xl mb-3">🌿</div>
              <h4 className="font-semibold mb-2">Trách nhiệm</h4>
              <p className="text-sm text-gray-500">
                Cam kết chất lượng và sự minh bạch trong từng sản phẩm.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8A96A] text-white text-center py-12">
        <h3 className="text-2xl font-semibold mb-4">
          Trở thành một phần của Witchy Bakery
        </h3>
        <p className="text-sm mb-6 opacity-90">
          Chúng tôi luôn chào đón những người yêu bánh và sáng tạo
        </p>
        <a
          href="/careers"
          className="inline-block bg-white text-[#C8A96A] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Xem tuyển dụng
        </a>
      </section>

    </main>
  );
}