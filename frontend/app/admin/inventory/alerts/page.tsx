// app/admin/inventory/alerts/page.tsx
'use client';

import Link from 'next/link';
import AdminShell from "../../components/AdminShell";

const lowStockItems = [
  { id: '3', name: 'Trứng gà', unit: 'quả', stock: 8, minStock: 20 },
  { id: '5', name: 'Bơ lạt', unit: 'kg', stock: 4, minStock: 5 },
];

const navItems = [
  { name: 'Danh sách nguyên liệu', path: '/admin/inventory', icon: '📦' },
  { name: 'Nhập kho', path: '/admin/inventory/import', icon: '📥' },
  { name: 'Cảnh báo tồn kho', path: '/admin/inventory/alerts', icon: '⚠️' },
];

export default function AlertsPage() {
  return (
    <AdminShell>
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Quản lý Kho</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    item.path === '/admin/inventory/alerts'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            ⚠️ Cảnh báo tồn kho thấp
          </h1>
          <p className="text-gray-600 mt-1">
            Những nguyên liệu có số lượng tồn kho ≤ ngưỡng cảnh báo cần nhập thêm.
          </p>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            ✅ Tất cả nguyên liệu đều có tồn kho an toàn!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lowStockItems.map((item) => {
              const shortage = item.minStock - item.stock;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow border-l-4 border-red-500 p-5">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Tồn kho: <span className="font-semibold text-red-600">{item.stock}</span> {item.unit}</p>
                    <p>Ngưỡng cảnh báo: {item.minStock} {item.unit}</p>
                    <p>Thiếu hụt: <span className="font-medium">{shortage > 0 ? shortage : 0}</span> {item.unit}</p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link href={`/admin/inventory/${item.id}`} className="text-blue-600 hover:underline text-sm">
                      Xem chi tiết
                    </Link>
                    <Link href="/admin/inventory/import" className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                      Nhập ngay
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
    </AdminShell>
  );
}