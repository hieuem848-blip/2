"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Logo + giới thiệu */}
        <div>
          <h2 className="text-[#C8A96A] text-2xl font-bold uppercase tracking-wide mb-4">
            Witchy Bakery
          </h2>

          <p className="leading-6 mb-6 text-gray-500">
            Chúng tôi tạo nên những chiếc bánh kem không chỉ đẹp mắt mà còn đậm đà hương vị, giúp bạn lưu giữ 
            những kỷ niệm ngọt ngào trong từng khoảnh khắc.
          </p>

          {/* Social media */}
          <div className="flex gap-4 text-gray-400">
            <Facebook size={18} className="hover:text-[#C8A96A] cursor-pointer transition" />
            <Instagram size={18} className="hover:text-[#C8A96A] cursor-pointer transition" />
            <Youtube size={18} className="hover:text-[#C8A96A] cursor-pointer transition" />
          </div>
        </div>

        {/* Sản phẩm */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Sản phẩm</h3>
          <ul className="space-y-3 text-gray-500">
            <li>
              <Link href="/products" className="relative group inline-block">
                <span className="group-hover:text-[#C8A96A] transition">
                  Tất cả sản phẩm
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

          </ul>
        </div>

        {/* Thông tin */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Thông tin</h3>
          <ul className="space-y-3 text-gray-500">

            <li>
              <Link href="/about" className="relative group inline-block">
                <span className="group-hover:text-[#C8A96A] transition">
                  Về chúng tôi
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link href="/news" className="relative group inline-block">
                <span className="group-hover:text-[#C8A96A] transition">
                  Tin tức & Bài viết
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link href="/maplocation" className="relative group inline-block">
                <span className="group-hover:text-[#C8A96A] transition">
                  Cửa hàng
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link href="/careers" className="relative group inline-block">
                <span className="group-hover:text-[#C8A96A] transition">
                  Tuyển dụng
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            <li>
              <Link href="/contact" className="relative group inline-block">
                <span className="group-hover:text-[#C8A96A] transition">
                  Liên hệ
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Liên hệ</h3>

          <ul className="space-y-4 text-gray-500">

            <li>
              <a
                href="https://www.google.com/maps/place/Witchy+Cafe+Bakery/@10.804053,106.676573,16z/data=!4m6!3m5!1s0x317529003745d3f3:0x20e627b898d3eb08!8m2!3d10.8040531!4d106.6765734!16s%2Fg%2F11v_8xhv1m?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group inline-flex gap-3 items-center"
              >
                <span className="flex gap-3 items-center text-gray-500 group-hover:text-[#C8A96A] transition">
                  <MapPin size={16} />
                  <span>81/25A Hồ Văn Huê, Phú Nhuận, TP.HCM</span>
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>

            <li className="relative group inline-flex gap-3 items-center">
              <span className="flex gap-3 items-center text-gray-500 group-hover:text-[#C8A96A] transition">
                <Phone size={16} />
                <span>1900 1234 56</span>
              </span>
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
            </li>

            <li className="relative group inline-flex gap-3 items-center">
              <span className="flex gap-3 items-center text-gray-500 group-hover:text-[#C8A96A] transition">
                <Mail size={16} />
                <span>info@witchybakery.vn</span>
              </span>

              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
            </li>
            
            <li className="relative group inline-flex gap-3 items-center">
              <span className="flex gap-3 items-center text-gray-500 group-hover:text-[#C8A96A] transition">
                <Clock size={16} />
                <span>Thứ 2 - Chủ nhật: 9:00 - 21:00</span>
              </span>

              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-300"></span>
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-5 border-t border-gray-200 text-xs text-gray-400 text-center md:text-left">
        © 2025 Witchy Bakery Việt Nam. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
}