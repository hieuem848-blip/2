// app/admin/inventory/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminShell from "../../components/AdminShell";

// Mock data cho nguyên liệu
const ingredientData: Record<string, any> = {
  '1': { id: '1', name: 'Bột mì', unit: 'kg', stock: 50, minStock: 10, createdAt: '2025-01-01', updatedAt: '2025-03-15' },
  '2': { id: '2', name: 'Đường trắng', unit: 'kg', stock: 30, minStock: 5, createdAt: '2025-01-02', updatedAt: '2025-03-14' },
  '3': { id: '3', name: 'Trứng gà', unit: 'quả', stock: 8, minStock: 20, createdAt: '2025-01-03', updatedAt: '2025-03-13' },
  '4': { id: '4', name: 'Sữa tươi', unit: 'lít', stock: 15, minStock: 8, createdAt: '2025-01-04', updatedAt: '2025-03-12' },
  '5': { id: '5', name: 'Bơ lạt', unit: 'kg', stock: 4, minStock: 5, createdAt: '2025-01-05', updatedAt: '2025-03-11' },
};

// Mock lịch sử giao dịch (có thêm giao dịch hủy)
const mockTransactions = [
  { id: 't1', type: 'import', quantity: 20, date: '2025-03-10', note: 'Nhập từ kho chính' },
  { id: 't2', type: 'import', quantity: 10, date: '2025-03-05', note: 'Mua mới' },
  { id: 't3', type: 'export', quantity: 5, date: '2025-03-01', note: 'Xuất bếp' },
  { id: 't4', type: 'cancel', quantity: 2, date: '2025-02-28', note: 'Hàng hỏng - hủy' },
];

const navItems = [
  { name: 'Danh sách nguyên liệu', path: '/admin/inventory', icon: '📦' },
  { name: 'Nhập kho', path: '/admin/inventory/import', icon: '📥' },
  { name: 'Cảnh báo tồn kho', path: '/admin/inventory/alerts', icon: '⚠️' },
];

export default function IngredientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const ingredient = ingredientData[id as string];
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', unit: '', minStock: 0 });

  // State cho phần hủy hàng
  const [cancelQuantity, setCancelQuantity] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  if (!ingredient) {
    return <div className="min-h-screen bg-gray-100 p-6">Không tìm thấy nguyên liệu</div>;
  }

  const handleUpdateInfo = () => {
    alert('Demo: cập nhật thông tin');
    setIsEditing(false);
  };

  const handleCancelStock = () => {
    const qty = parseFloat(cancelQuantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Vui lòng nhập số lượng hủy hợp lệ (>0)');
      return;
    }
    if (qty > ingredient.stock) {
      alert(`Số lượng hủy không thể vượt quá tồn kho hiện tại (${ingredient.stock})`);
      return;
    }
    alert(`✅ Đã hủy ${qty} ${ingredient.unit} ${ingredient.name}\nLý do: ${cancelReason || 'Không có ghi chú'}`);
    // Trong demo chỉ alert, không cập nhật stock thực tế.
    setCancelQuantity('');
    setCancelReason('');
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
                    item.path === `/admin/inventory/${id}`
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
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Chi tiết nguyên liệu</h1>
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
              ← Quay lại
            </button>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Thông tin chung</h2>
              <button onClick={() => setIsEditing(!isEditing)} className="text-blue-600 hover:text-blue-800">
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Tên nguyên liệu</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Đơn vị</label>
                  <input
                    type="text"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Ngưỡng cảnh báo</label>
                  <input
                    type="number"
                    value={editForm.minStock}
                    onChange={(e) => setEditForm({ ...editForm, minStock: parseInt(e.target.value) })}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <button onClick={handleUpdateInfo} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Lưu thay đổi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Tên:</span> {ingredient.name}</div>
                <div><span className="text-gray-500">Đơn vị:</span> {ingredient.unit}</div>
                <div><span className="text-gray-500">Tồn kho hiện tại:</span> <strong className="text-lg">{ingredient.stock}</strong></div>
                <div><span className="text-gray-500">Ngưỡng cảnh báo:</span> {ingredient.minStock}</div>
                <div><span className="text-gray-500">Ngày tạo:</span> {ingredient.createdAt}</div>
                <div><span className="text-gray-500">Cập nhật lần cuối:</span> {ingredient.updatedAt}</div>
              </div>
            )}
          </div>

          {/* Điều chỉnh tồn kho (tăng/giảm thủ công) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Điều chỉnh tồn kho</h2>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium">Số lượng mới</label>
                <input type="number" className="border rounded px-3 py-2 w-full" placeholder={`Hiện tại: ${ingredient.stock}`} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Ghi chú</label>
                <input type="text" className="border rounded px-3 py-2 w-full" placeholder="Lý do điều chỉnh" />
              </div>
              <button className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700">
                Cập nhật tồn kho
              </button>
            </div>
          </div>

          {/* 🆕 PHẦN HỦY HÀNG (Xuất kho do hỏng/hết hạn) */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-600">🗑️ Hủy hàng / Xuất kho hao hụt</span>
            </h2>
            <p className="text-sm text-gray-500 mb-4">Sử dụng khi nguyên liệu bị hỏng, hết hạn, hoặc cần xuất trả.</p>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-48">
                <label className="block text-sm font-medium">Số lượng hủy *</label>
                <input
                  type="number"
                  step="any"
                  value={cancelQuantity}
                  onChange={(e) => setCancelQuantity(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Nhập số lượng"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Lý do hủy</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Ví dụ: Hàng hết hạn, vỡ, trả NCC..."
                />
              </div>
              <button
                onClick={handleCancelStock}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              * Hành động này sẽ giảm tồn kho tương ứng. (Demo chỉ hiển thị thông báo)
            </div>
          </div>

          {/* Lịch sử giao dịch */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch sử nhập/xuất/hủy</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ngày</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Loại</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Số lượng</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockTransactions.map((t) => {
                    let typeLabel = '';
                    let typeColor = '';
                    if (t.type === 'import') {
                      typeLabel = 'NHẬP';
                      typeColor = 'bg-green-100 text-green-700';
                    } else if (t.type === 'export') {
                      typeLabel = 'XUẤT';
                      typeColor = 'bg-blue-100 text-blue-700';
                    } else if (t.type === 'cancel') {
                      typeLabel = 'HỦY';
                      typeColor = 'bg-red-100 text-red-700';
                    }
                    return (
                      <tr key={t.id}>
                        <td className="px-4 py-2 text-sm">{t.date}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${typeColor}`}>
                            {typeLabel}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{t.quantity}</td>
                        <td className="px-4 py-2 text-sm">{t.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminShell>
  );
}