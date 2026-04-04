"use client";
import { useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { adminCustomCakeApi, formatPrice, CUSTOM_STATUS } from "../../../lib/adminApi";
import Link from "next/link";

interface CustomDetail {
  request: {
    _id: string; status: string; description: string; note?: string;
    quotedPrice?: number; adminNote?: string; createdAt: string;
    user?: { displayName: string; email: string; phone: string };
  };
  images: { imageUrl: string }[];
}

export default function CustomCakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [detail, setDetail] = useState<CustomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      adminCustomCakeApi.getById(p.id)
        .then(d => setDetail(d as unknown as CustomDetail))
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [params]);

  const reload = async () => {
    const d = await adminCustomCakeApi.getById(id);
    setDetail(d as unknown as CustomDetail);
  };

  const handleQuote = async () => {
    if (!quotePrice) { alert("Vui lòng nhập giá báo"); return; }
    setActing(true);
    try {
      await adminCustomCakeApi.quote(id, { price: Number(quotePrice), note: quoteNote });
      await reload();
      setQuotePrice(""); setQuoteNote("");
      alert("Đã báo giá cho khách!");
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Lỗi"); }
    finally { setActing(false); }
  };

  const handleReject = async () => {
    if (!confirm("Từ chối yêu cầu này?")) return;
    setActing(true);
    try {
      await adminCustomCakeApi.reject(id, rejectReason);
      await reload();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Lỗi"); }
    finally { setActing(false); }
  };

  const handleComplete = async () => {
    if (!confirm("Xác nhận hoàn thành bánh?")) return;
    setActing(true);
    try {
      await adminCustomCakeApi.complete(id);
      await reload();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Lỗi"); }
    finally { setActing(false); }
  };

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#C8A96A", borderTopColor: "transparent" }} />
      </div>
    </AdminShell>
  );

  if (!detail) return <AdminShell><div className="text-center py-16 text-gray-400">Không tìm thấy yêu cầu</div></AdminShell>;

  const { request, images } = detail;
  const st = CUSTOM_STATUS[request.status] ?? { label: request.status, color: "text-gray-500 bg-gray-50 border-gray-200" };

  return (
    <AdminShell>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/custom-cakes" className="text-sm" style={{ color: "#C8A96A" }}>← Bánh Custom</Link>
          <span style={{ color: "#ccc" }}>/</span>
          <h1 className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1a1a1a" }}>
            Yêu cầu #{request._id.slice(-8).toUpperCase()}
          </h1>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${st.color}`}>{st.label}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detail */}
          <div className="lg:col-span-2 space-y-5">
            {/* Thông tin yêu cầu */}
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#e8ddd0" }}>
              <h2 className="font-semibold mb-3" style={{ color: "#1a1a1a" }}>Mô tả yêu cầu</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{request.description}</p>
              {request.note && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "#f0e8dc" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#888" }}>Ghi chú thêm:</p>
                  <p className="text-sm" style={{ color: "#666" }}>{request.note}</p>
                </div>
              )}
              {request.quotedPrice && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "#f0e8dc" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#888" }}>Giá đã báo:</p>
                  <p className="text-lg font-bold" style={{ color: "#C8A96A" }}>{formatPrice(request.quotedPrice)}</p>
                </div>
              )}
              {request.adminNote && (
                <div className="mt-3 p-3 rounded-xl" style={{ background: "#fdf6ec" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#888" }}>Ghi chú của admin:</p>
                  <p className="text-sm" style={{ color: "#666" }}>{request.adminNote}</p>
                </div>
              )}
            </div>

            {/* Images */}
            {images && images.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#e8ddd0" }}>
                <h2 className="font-semibold mb-3" style={{ color: "#1a1a1a" }}>Hình ảnh tham khảo ({images.length})</h2>
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img.imageUrl} alt={`Ref ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ borderColor: "#e0d0b8" }}
                      onClick={() => window.open(img.imageUrl, "_blank")} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: customer + actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: "#e8ddd0" }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: "#1a1a1a" }}>Khách hàng</h3>
              <div className="space-y-2 text-sm">
                <p style={{ color: "#333" }}><strong>{request.user?.displayName ?? "—"}</strong></p>
                <p style={{ color: "#666" }}>{request.user?.email ?? ""}</p>
                <p style={{ color: "#666" }}>{request.user?.phone ?? ""}</p>
                <p className="text-xs mt-2" style={{ color: "#aaa" }}>
                  Ngày gửi: {new Date(request.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            {/* Action panel */}
            {request.status === "pending" && (
              <div className="bg-white rounded-2xl p-5 border space-y-4" style={{ borderColor: "#e8ddd0" }}>
                <h3 className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>Báo giá cho khách</h3>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#888" }}>Giá báo (VND) *</label>
                  <input type="number" placeholder="500000" value={quotePrice} onChange={e => setQuotePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ borderColor: "#e0d0b8", background: "#fdf9f4" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#888" }}>Ghi chú (tùy chọn)</label>
                  <textarea rows={2} value={quoteNote} onChange={e => setQuoteNote(e.target.value)}
                    placeholder="Ghi chú thêm cho khách..."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                    style={{ borderColor: "#e0d0b8", background: "#fdf9f4" }} />
                </div>
                <button onClick={handleQuote} disabled={acting}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: "#C8A96A" }}>
                  {acting ? "Đang gửi..." : "Gửi báo giá"}
                </button>
                <div className="pt-1 border-t" style={{ borderColor: "#f0e8dc" }}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#888" }}>Lý do từ chối</label>
                  <input placeholder="Lý do..." value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-2"
                    style={{ borderColor: "#e0d0b8", background: "#fdf9f4" }} />
                  <button onClick={handleReject} disabled={acting}
                    className="w-full py-2 rounded-xl text-sm font-medium border disabled:opacity-60 hover:bg-red-50"
                    style={{ borderColor: "#fca5a5", color: "#dc2626" }}>
                    Từ chối yêu cầu
                  </button>
                </div>
              </div>
            )}

            {request.status === "accepted" && (
              <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: "#e8ddd0" }}>
                <h3 className="font-semibold text-sm mb-3" style={{ color: "#1a1a1a" }}>Xác nhận hoàn thành</h3>
                <button onClick={handleComplete} disabled={acting}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: "#10b981" }}>
                  {acting ? "..." : "✓ Đánh dấu hoàn thành"}
                </button>
              </div>
            )}

            {["quoted", "completed", "rejected"].includes(request.status) && (
              <div className="bg-white rounded-2xl p-5 border text-center" style={{ borderColor: "#e8ddd0" }}>
                <div className="text-3xl mb-2">
                  {request.status === "completed" ? "✅" : request.status === "quoted" ? "💰" : "❌"}
                </div>
                <p className="text-sm font-medium" style={{ color: "#555" }}>{st.label}</p>
                {request.status === "quoted" && request.quotedPrice && (
                  <p className="text-lg font-bold mt-1" style={{ color: "#C8A96A" }}>{formatPrice(request.quotedPrice)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
