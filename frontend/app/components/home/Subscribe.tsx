"use client";

export default function SubscribePage() {
  return (
    <div className="bg-[#f3efe9] py-10 px-4 flex justify-center">

      {/* CARD */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] px-8 py-10">

        {/* Title */}
        <h1 className="text-3xl font-serif text-gray-800 mb-6 text-center">
          Đăng ký nhận thông tin
        </h1>

        {/* Desc */}
        <p className="text-sm text-gray-500 mb-8 text-center">
          Đăng ký để nhận thông tin liên lạc về các sản phẩm, dịch vụ, cửa hàng, sự kiện và các vấn đề đáng quan tâm của Witchy Bakery.
        </p>

        {/* FORM */}
        <form className="space-y-8">

          {/* Email */}
          <div className="border-b border-[#d6c2a3] pb-3 focus-within:border-[#c8a46b]">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn*"
              className="w-full bg-transparent outline-none placeholder:text-[#c8a46b] text-gray-800 text-sm"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#1c1a17] text-white py-4 rounded-md font-semibold tracking-wide hover:opacity-90 transition"
          >
            ĐĂNG KÝ
          </button>

        </form>

      </div>
    </div>
  );
}