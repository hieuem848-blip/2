'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdminShell from "../components/AdminShell";

// Mock data
const mockIngredients = [
  { id: '1', name: 'Bột mì', unit: 'kg', stock: 50, minStock: 10 },
  { id: '2', name: 'Đường trắng', unit: 'kg', stock: 30, minStock: 5 },
  { id: '3', name: 'Trứng gà', unit: 'quả', stock: 8, minStock: 20 },
  { id: '4', name: 'Sữa tươi', unit: 'lít', stock: 15, minStock: 8 },
  { id: '5', name: 'Bơ lạt', unit: 'kg', stock: 4, minStock: 5 },
];

const getStockStatus = (stock: number, minStock: number) => {
  if (stock <= minStock) return { text: 'Sắp hết', color: 'text-red-600 bg-red-100' };
  if (stock <= minStock * 2) return { text: 'Còn ít', color: 'text-yellow-600 bg-yellow-100' };
  return { text: 'Bình thường', color: 'text-green-600 bg-green-100' };
};

const navItems = [
  { name: 'Danh sách nguyên liệu', path: '/admin/inventory', icon: '📦' },
  { name: 'Nhập kho', path: '/admin/inventory/import', icon: '📥' },
  { name: 'Cảnh báo tồn kho', path: '/admin/inventory/alerts', icon: '⚠️' },
];

export default function InventoryListPage() {
  const [search, setSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const filteredIngredients = mockIngredients.filter((ing) => {
    const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase());
    const matchLowStock = showLowStockOnly ? ing.stock <= ing.minStock : true;
    return matchSearch && matchLowStock;
  });

  return (
    <AdminShell>
    <div className="flex h-full min-h-screen bg-gray-100 flex">
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
                    item.path === '/admin/inventory'
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Danh sách nguyên liệu</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Thêm nguyên liệu
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-64"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
            />
            Chỉ hiển thị nguyên liệu tồn kho thấp
          </label>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nguyên liệu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn vị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngưỡng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIngredients.map((ing) => {
                const status = getStockStatus(ing.stock, ing.minStock);
                return (
                  <tr key={ing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{ing.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ing.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ing.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ing.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <Link href={`/admin/inventory/${ing.id}`} className="text-blue-600 hover:text-blue-800">
                        Chi tiết
                      </Link>
                      <button className="text-red-600 hover:text-red-800 ml-2">Xóa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredIngredients.length === 0 && (
            <div className="text-center py-8 text-gray-500">Không có nguyên liệu nào</div>
          )}
        </div>
      </main>
    </div>
    </AdminShell>
  );
}