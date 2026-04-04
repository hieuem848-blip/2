"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
  image: "/cake3.jpg",
  title: `Hòa quyện trong từng lớp bánh`,
  desc: "Những chiếc bánh kem được tạo nên từ sự tỉ mỉ và cảm hứng, mang đến trải nghiệm ngọt ngào trọn vẹn cho mọi khoảnh khắc của bạn.",
  bg: "#EC6A85",
  },
  {
  image: "/cake2.jpg", 
  title: `Gửi trọn yêu thương qua mỗi sản phẩm`,
  desc: "Không chỉ là món tráng miệng, mỗi chiếc bánh là một cách để bạn chia sẻ niềm vui và những cảm xúc chân thành đến người thân yêu.",
  bg: "#f3efe9",
  textColor: "text-[#C8A96A]",
  },
  {
  image: "/cake1.jpg",
  title: `Ngọt dịu trong từng hương vị`,
  desc: "Sự kết hợp hài hòa giữa nguyên liệu chất lượng và công thức riêng, tạo nên những chiếc bánh vừa đẹp mắt vừa tinh tế.",
  bg: "#6BBF8A",
  },
];

export default function HeroBannerPage() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex(index === 0 ? slides.length - 1 : index - 1);
  };

  const next = () => {
    setIndex(index === slides.length - 1 ? 0 : index + 1);
  };

  // ảnh chạy tự động
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[700px] overflow-hidden group">

      {/* SLIDER */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full h-full flex shrink-0">

            {/* LEFT IMAGE */}
            <div className="w-1/2 relative">
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div
              className={`w-1/2 flex flex-col justify-center px-24 ${
                slide.textColor ? slide.textColor : "text-white"
              }`}
              style={{ backgroundColor: slide.bg }}
            >
              <p className="uppercase tracking-[0.25em] text-sm mb-6">
                WITCHY BAKERY - HANDEMADE
              </p>

              <p className="text-sm mb-6 opacity-90 leading-relaxed">
                handemade cakes for every occasion
              </p>  

              <h1 className="text-[64px] leading-[1.1] font-serif mb-6 whitespace-pre-line">
                {slide.title}
              </h1>

              <p className="text-sm mb-10 max-w-md opacity-90 leading-relaxed">
                {slide.desc}
              </p>

              {/* BUTTON */}
              <div className="flex items-center gap-4">
                <Link
                  href="/products"
                  className={`px-8 py-4 flex items-center gap-3 transition ${
                    slide.bg === "#f3efe9"
                      ? "bg-[#C8A96A] text-white hover:opacity-90"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  XEM NGAY
                </Link>
              </div>

              {/* DOTS */}
              <div className="flex items-center gap-2 mt-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index
                        ? "bg-white w-6"
                        : "bg-white/50 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prev}
        className="
          absolute left-0 top-1/2 -translate-y-1/2
          bg-black/80 text-white p-3 rounded-md
          opacity-0 -translate-x-10
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-300
        "
      >
        <ChevronLeft size={20} />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={next}
        className="
          absolute right-0 top-1/2 -translate-y-1/2
          bg-black/80 text-white p-3 rounded-md
          opacity-0 translate-x-10
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-300
        "
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}