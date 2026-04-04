"use client";

import Image from "next/image";
import Link from "next/link";

export default function BrandSectionPage() {
  return (
    <section className="relative w-full h-[200px] md:h-[400px]">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/footer_bg.jpg"
        alt=""
        fill
        className="object-cover"
      />

      {/* CARD */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-[#f3efe9] max-w-xl w-full rounded-lg shadow-xl px-8 py-10 text-center">

          {/* TITLE */}
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
            <span className="italic">Câu chuyện thương hiệu</span>
          </h2>

          {/* DESC */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
            Tại Witchy Bakery, mỗi chiếc bánh kem không chỉ là một món tráng miệng,
            Một chiếc bánh nhỏ có thể lưu giữ cả một khoảnh khắc lớn.
            Tại Witchy Bakery, chúng tôi tạo nên những chiếc bánh kem
            bằng sự tỉ mỉ và yêu thương, để mỗi lần bạn cắt bánh
            là một lần kỷ niệm được trọn vẹn hơn.
          </p>

          {/* BUTTON */}
          <Link href="/about">
            <button className="bg-[#1c1a17] text-white px-8 py-4 flex items-center justify-center gap-3 mx-auto hover:opacity-90 transition">
              TÌM HIỂU THÊM
            </button>
          </Link>

        </div>
      </div>
    </section>
  );
}