"use client";

import Image from "next/image";
import Link from "next/link";

export const posts = [
  {
    id: 1,
    title: "Nghệ thuật làm bánh kem thủ công 🎂",
    slug: "nghe-thuat-lam-banh",
    excerpt: "Mỗi chiếc bánh tại Witchy Bakery đều được tạo nên từ sự tỉ mỉ...",
    image: "/cake1.jpg",
    content: `
Tại Witchy Bakery, mỗi chiếc bánh là một tác phẩm nghệ thuật.

Từ việc đánh kem, tạo hình cho đến trang trí, tất cả đều được thực hiện thủ công.

Chúng tôi không chỉ làm bánh — chúng tôi tạo ra cảm xúc.
    `,
  },
  {
    id: 2,
    title: "Top 5 bánh sinh nhật được yêu thích 🍓",
    slug: "top-banh-sinh-nhat",
    excerpt: "Khám phá những mẫu bánh sinh nhật được yêu thích nhất...",
    image: "/cake2.jpg",
    content: `
Top bánh bán chạy:

1. Bánh dâu tây  
2. Bánh socola  
3. Bánh matcha  
4. Bánh trái cây  
5. Tiramisu  

Tất cả đều được khách hàng đánh giá cao.
    `,
  },
  {
    id: 3,
    title: "Bí mật nguyên liệu tươi mỗi ngày 🥛",
    slug: "nguyen-lieu-tuoi",
    excerpt: "Chúng tôi lựa chọn nguyên liệu tươi mỗi ngày...",
    image: "/cake3.jpg",
    content: `
Nguyên liệu luôn:

✔ Tươi mỗi ngày  
✔ Không chất bảo quản  
✔ Chọn lọc kỹ  

Đây là yếu tố tạo nên chất lượng.
    `,
  },
  {
    id: 4,
    title: "Cách bảo quản bánh kem ❄️",
    slug: "bao-quan-banh",
    excerpt: "Giữ bánh luôn tươi ngon với mẹo đơn giản...",
    image: "/cake1.jpg",
    content: `
✔ Bảo quản 2-6°C  
✔ Không để ngoài quá lâu  
✔ Dùng trong 24h  

Để giữ vị ngon nhất.
    `,
  },
  {
    id: 5,
    title: "Xu hướng bánh kem 2026 ✨",
    slug: "xu-huong-2026",
    excerpt: "Phong cách bánh kem hiện đại đang lên ngôi...",
    image: "/cake2.jpg",
    content: `
Trend 2026:

- Minimal  
- Pastel  
- Vintage Hàn  

Phong cách nhẹ nhàng đang hot.
    `,
  },
  {
    id: 6,
    title: "Bánh cưới sang trọng 💍",
    slug: "banh-cuoi",
    excerpt: "Lựa chọn bánh cưới hoàn hảo...",
    image: "/cake3.jpg",
    content: `
Bánh cưới cần:

✔ Tinh tế  
✔ Sang trọng  
✔ Cá nhân hóa  

Witchy nhận thiết kế riêng.
    `,
  },
];

export default function NewsPage() {
  return (
    <main className="bg-gray-100 min-h-screen">

      {/* HERO */}
      <section className="relative h-[220px] md:h-[260px]">
        <Image src="/cakebg.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <p className="text-xs tracking-[0.3em] mb-3">Witchy Bakery</p>
          <h1 className="text-4xl font-bold">Tin tức & Bài viết</h1>
        </div>
      </section>

      {/* LIST */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group">

              <div>
                <div className="relative h-[200px] rounded-xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold group-hover:text-[#C8A96A]">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

            </Link>
          ))}

        </div>
      </div>
    </main>
  );
}