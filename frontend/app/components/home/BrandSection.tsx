"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
        
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }} // chỉ chạy 1 lần
          className="bg-[#f3efe9] max-w-xl w-full rounded-lg shadow-xl px-8 py-10 text-center"
        >

          {/* TITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-gray-800 mb-4"
          >
            <span className="italic">Câu chuyện thương hiệu</span>
          </motion.h2>

          {/* DESC */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-sm md:text-base leading-relaxed mb-8"
          >
            Tại Witchy Bakery, mỗi chiếc bánh kem không chỉ là một món tráng miệng,
            Một chiếc bánh nhỏ có thể lưu giữ cả một khoảnh khắc lớn.
            Tại Witchy Bakery, chúng tôi tạo nên những chiếc bánh kem
            bằng sự tỉ mỉ và yêu thương, để mỗi lần bạn cắt bánh
            là một lần kỷ niệm được trọn vẹn hơn.
          </motion.p>

          {/* BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/about">
              <button className="bg-[#1c1a17] text-white px-8 py-4 flex items-center justify-center gap-3 mx-auto hover:opacity-90 transition">
                TÌM HIỂU THÊM
              </button>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}