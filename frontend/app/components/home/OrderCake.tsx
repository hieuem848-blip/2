"use client";

import Image from "next/image";
import Link from "next/link";

export default function OrderCakePage() {
  return (
    <section className="relative w-full h-[720px] overflow-hidden">
      <Image
        src="/cakebg.png"
        alt="Nhận đặt bánh theo yêu cầu"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/35"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-xl text-white">
            <p className="text-xs tracking-[0.3em] uppercase text-amber-300 mb-4 font-semibold">Witchy Bakery</p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Nhận đặt bánh<br />
              <span className="text-[#C8A96A]">theo yêu cầu</span>
            </h1>
            <p className="text-white/75 text-base mb-8 leading-relaxed max-w-sm">
              Thiết kế riêng theo ý tưởng của bạn — chữ, màu sắc, hình ảnh, chủ đề. Mỗi chiếc bánh là một tác phẩm nghệ thuật.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="bg-[#C8A96A] text-white px-7 py-3.5 text-sm tracking-wide hover:bg-[#a0823e] transition">
                Xem sản phẩm
              </Link>
              <Link
                href="/custom-cake"
                className="bg-white text-black px-7 py-3.5 text-sm tracking-wide hover:text-[#C8A96A]  transition">
                Liên hệ đặt bánh
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
