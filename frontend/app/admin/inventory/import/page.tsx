// app/admin/inventory/import/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from "../../components/AdminShell";

const mockIngredients = [
  { id: '1', name: 'Bột mì', unit: 'kg', stock: 50, minStock: 10 },
  { id: '2', name: 'Đường trắng', unit: 'kg', stock: 30, minStock: 5 },
  { id: '3', name: 'Trứng gà', unit: 'quả', stock: 8, minStock: 20 },
  { id: '4', name: 'Sữa tươi', unit: 'lít', stock: 15, minStock: 8 },
  { id: '5', name: 'Bơ lạt', unit: 'kg', stock: 4, minStock: 5 },
];

const navItems = [
  { name: 'Danh sách nguyên liệu', path: '/admin/inventory', icon: '📦' },
  { name: 'Nhập kho', path: '/admin/inventory/import', icon: '📥' },
  { name: 'Cảnh báo tồn kho', path: '/admin/inventory/alerts', icon: '⚠️' },
];

export default function ImportPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const selectedIngredient = mockIngredients.find((i) => i.id === selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demo: nhập kho thành công');
    // router.push('/admin/inventory');
  };

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
                    item.path === '/admin/inventory/import'
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Nhập kho nguyên liệu</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Chọn nguyên liệu *</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Chọn nguyên liệu --</option>
                {mockIngredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} (Tồn: {ing.stock} {ing.unit})
                  </option>
                ))}
              </select>
            </div>

            {selectedIngredient && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p>Đơn vị tính: <strong>{selectedIngredient.unit}</strong></p>
                <p>Tồn kho hiện tại: <strong>{selectedIngredient.stock}</strong></p>
                <p>Ngưỡng cảnh báo: <strong>{selectedIngredient.minStock}</strong></p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Số lượng nhập *</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ví dụ: 10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú (không bắt buộc)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                placeholder="Nhà cung cấp, lý do nhập,..."
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                Xác nhận nhập kho
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
    </AdminShell>
  );
}