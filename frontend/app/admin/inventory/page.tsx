// app/admin/inventory/page.tsx
'use client';

import { useState } from 'react';
import {
  Package,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  X,
  ShoppingBag,
  History,
} from 'lucide-react';

// Định nghĩa kiểu dữ liệu
interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minThreshold: number;
}

interface MovementLog {
  id: string;
  ingredientId: string;
  ingredientName: string;
  type: 'import' | 'export' | 'spoilage';
  quantity: number;
  reason: string;
  date: Date;
}

// Dữ liệu mẫu ban đầu
const initialIngredients: Ingredient[] = [
  { id: '1', name: 'Bột mì', unit: 'kg', stock: 12.5, minThreshold: 3 },
  { id: '2', name: 'Đường', unit: 'kg', stock: 8, minThreshold: 2 },
  { id: '3', name: 'Trứng', unit: 'quả', stock: 45, minThreshold: 20 },
  { id: '4', name: 'Sữa tươi', unit: 'lít', stock: 6, minThreshold: 2 },
  { id: '5', name: 'Kem tươi', unit: 'lít', stock: 3.2, minThreshold: 1.5 },
  { id: '6', name: 'Bơ', unit: 'kg', stock: 2.5, minThreshold: 1 },
  { id: '7', name: 'Socola', unit: 'kg', stock: 1.8, minThreshold: 0.5 },
  { id: '8', name: 'Trái cây', unit: 'kg', stock: 4, minThreshold: 1.5 },
  { id: '9', name: 'Hộp bánh', unit: 'cái', stock: 30, minThreshold: 10 },
];

const initialLogs: MovementLog[] = [
  {
    id: '1',
    ingredientId: '1',
    ingredientName: 'Bột mì',
    type: 'import',
    quantity: 10,
    reason: 'Nhập hàng từ nhà cung cấp',
    date: new Date(2026, 3, 9),
  },
  {
    id: '2',
    ingredientId: '5',
    ingredientName: 'Kem tươi',
    type: 'export',
    quantity: 0.5,
    reason: 'Làm bánh kem sinh nhật',
    date: new Date(2026, 3, 10),
  },
];

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [logs, setLogs] = useState<MovementLog[]>(initialLogs);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: '', stock: 0, minThreshold: 0 });
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [modalType, setModalType] = useState<'import' | 'export' | 'spoilage'>('import');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Thêm nguyên liệu mới
  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.unit || newIngredient.stock < 0) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const newId = Date.now().toString();
    setIngredients([
      ...ingredients,
      {
        id: newId,
        name: newIngredient.name,
        unit: newIngredient.unit,
        stock: newIngredient.stock,
        minThreshold: newIngredient.minThreshold,
      },
    ]);
    addLog(newId, newIngredient.name, 'import', newIngredient.stock, 'Thêm nguyên liệu mới vào kho');
    setShowAddIngredient(false);
    setNewIngredient({ name: '', unit: '', stock: 0, minThreshold: 0 });
    setSuccessMsg('Đã thêm nguyên liệu mới!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Thêm log
  const addLog = (ingredientId: string, ingredientName: string, type: 'import' | 'export' | 'spoilage', qty: number, reasonText: string) => {
    const newLog: MovementLog = {
      id: Date.now().toString(),
      ingredientId,
      ingredientName,
      type,
      quantity: qty,
      reason: reasonText,
      date: new Date(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Giữ 50 log gần nhất
  };

  // Xử lý nhập/xuất/hủy
  const handleAction = () => {
    if (!selectedIngredient) return;
    if (quantity <= 0) {
      setError('Số lượng phải lớn hơn 0');
      return;
    }

    if (modalType === 'import') {
      // Nhập kho: tăng stock
      setIngredients(prev =>
        prev.map(ing =>
          ing.id === selectedIngredient.id
            ? { ...ing, stock: ing.stock + quantity }
            : ing
        )
      );
      addLog(selectedIngredient.id, selectedIngredient.name, 'import', quantity, reason || 'Nhập kho');
      setSuccessMsg(`Đã nhập ${quantity} ${selectedIngredient.unit} ${selectedIngredient.name}`);
    } 
    else if (modalType === 'export') {
      // Xuất kho: giảm stock (dùng để làm bánh)
      if (selectedIngredient.stock < quantity) {
        setError(`Không đủ tồn kho! Chỉ còn ${selectedIngredient.stock} ${selectedIngredient.unit}`);
        return;
      }
      setIngredients(prev =>
        prev.map(ing =>
          ing.id === selectedIngredient.id
            ? { ...ing, stock: ing.stock - quantity }
            : ing
        )
      );
      addLog(selectedIngredient.id, selectedIngredient.name, 'export', quantity, reason || 'Xuất kho sử dụng');
      setSuccessMsg(`Đã xuất ${quantity} ${selectedIngredient.unit} ${selectedIngredient.name}`);
    } 
    else if (modalType === 'spoilage') {
      // Hủy hàng (hao hụt, hết hạn, lỗi)
      if (selectedIngredient.stock < quantity) {
        setError(`Không đủ tồn kho để hủy! Chỉ còn ${selectedIngredient.stock} ${selectedIngredient.unit}`);
        return;
      }
      if (!reason) {
        setError('Vui lòng nhập lý do hủy (hết hạn, hư hỏng, v.v.)');
        return;
      }
      setIngredients(prev =>
        prev.map(ing =>
          ing.id === selectedIngredient.id
            ? { ...ing, stock: ing.stock - quantity }
            : ing
        )
      );
      addLog(selectedIngredient.id, selectedIngredient.name, 'spoilage', quantity, reason);
      setSuccessMsg(`Đã hủy ${quantity} ${selectedIngredient.unit} ${selectedIngredient.name} - Lý do: ${reason}`);
    }

    // Reset modal
    setModalOpen(false);
    setSelectedIngredient(null);
    setQuantity(0);
    setReason('');
    setError('');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const openModal = (ingredient: Ingredient, type: 'import' | 'export' | 'spoilage') => {
    setSelectedIngredient(ingredient);
    setModalType(type);
    setQuantity(0);
    setReason('');
    setError('');
    setModalOpen(true);
  };

  // Lấy icon cho log
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'import': return <Plus className="w-4 h-4 text-green-600" />;
      case 'export': return <Minus className="w-4 h-4 text-blue-600" />;
      case 'spoilage': return <Trash2 className="w-4 h-4 text-red-600" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getLogTypeText = (type: string) => {
    switch (type) {
      case 'import': return 'Nhập kho';
      case 'export': return 'Xuất kho';
      case 'spoilage': return 'Hủy / Hao hụt';
      default: return '';
    }
  };

  const lowStockIngredients = ingredients.filter(ing => ing.stock <= ing.minThreshold);
  const totalIngredients = ingredients.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Thông báo thành công */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý kho</h1>
        <p className="text-gray-600">Quản lý nguyên liệu, nhập/xuất kho và hao hụt</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng nguyên liệu</p>
              <p className="text-2xl font-bold">{totalIngredients}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sắp hết hàng</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockIngredients.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Giao dịch hôm nay</p>
              <p className="text-2xl font-bold">{logs.filter(l => l.date.toDateString() === new Date().toDateString()).length}</p>
            </div>
            <History className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow mb-6 p-4 flex justify-between items-center">
        <button
          onClick={() => setShowAddIngredient(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm nguyên liệu mới
        </button>
        <p className="text-sm text-gray-500">* Cảnh báo đỏ: nguyên liệu dưới ngưỡng tồn</p>
      </div>

      {/* Ingredient Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nguyên liệu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngưỡng cảnh báo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {ingredient.stock <= ingredient.minThreshold && (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="font-medium text-gray-900">{ingredient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ingredient.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-semibold ${ingredient.stock <= ingredient.minThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                      {ingredient.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ingredient.minThreshold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(ingredient, 'import')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Nhập
                      </button>
                      <button
                        onClick={() => openModal(ingredient, 'export')}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm flex items-center gap-1"
                      >
                        <Minus className="w-3 h-3" /> Xuất
                      </button>
                      <button
                        onClick={() => openModal(ingredient, 'spoilage')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử giao dịch */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5" /> Lịch sử nhập/xuất/hủy gần đây
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nguyên liệu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Số lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Lý do</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Chưa có giao dịch nào</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.date.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{log.ingredientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        log.type === 'import' ? 'bg-green-100 text-green-800' :
                        log.type === 'export' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getLogIcon(log.type)} {getLogTypeText(log.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{log.quantity}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-md truncate">{log.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm nguyên liệu */}
      {showAddIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm nguyên liệu mới</h2>
              <button onClick={() => setShowAddIngredient(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên nguyên liệu"
                className="w-full border rounded-lg px-3 py-2"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Đơn vị (kg, lít, quả...)"
                className="w-full border rounded-lg px-3 py-2"
                value={newIngredient.unit}
                onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
              />
              <input
                type="number"
                placeholder="Số lượng tồn đầu"
                className="w-full border rounded-lg px-3 py-2"
                value={newIngredient.stock}
                onChange={(e) => setNewIngredient({...newIngredient, stock: parseFloat(e.target.value) || 0})}
              />
              <input
                type="number"
                placeholder="Ngưỡng cảnh báo"
                className="w-full border rounded-lg px-3 py-2"
                value={newIngredient.minThreshold}
                onChange={(e) => setNewIngredient({...newIngredient, minThreshold: parseFloat(e.target.value) || 0})}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddIngredient} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex-1">Thêm</button>
              <button onClick={() => setShowAddIngredient(false)} className="border px-4 py-2 rounded-lg">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nhập/Xuất/Hủy */}
      {modalOpen && selectedIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalType === 'import' && `Nhập kho: ${selectedIngredient.name}`}
                {modalType === 'export' && `Xuất kho: ${selectedIngredient.name}`}
                {modalType === 'spoilage' && `Hủy / Hao hụt: ${selectedIngredient.name}`}
              </h2>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Số lượng ({selectedIngredient.unit})</label>
                <input
                  type="number"
                  step="any"
                  className="w-full border rounded-lg px-3 py-2"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lý do {modalType === 'spoilage' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder={modalType === 'import' ? 'Nhập từ nhà cung cấp...' : modalType === 'export' ? 'Làm bánh...' : 'Hết hạn, hư hỏng...'}
                  className="w-full border rounded-lg px-3 py-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={handleAction} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex-1">Xác nhận</button>
              <button onClick={() => setModalOpen(false)} className="border px-4 py-2 rounded-lg">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}