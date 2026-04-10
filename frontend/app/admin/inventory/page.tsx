// app/admin/inventory/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../components/AdminShell';
import {
  adminInventoryApi,
  Ingredient,
  InventoryLog,
  InventoryStats,
} from '../../lib/adminApi';
import {
  Package,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  X,
  History,
  RefreshCw,
  Pencil,
} from 'lucide-react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: '', stock: 0, minThreshold: 0 });

  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [editForm, setEditForm] = useState({ name: '', unit: '', minThreshold: 0 });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [modalType, setModalType] = useState<'import' | 'export' | 'spoilage'>('import');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ingredientsRes, logsRes, statsRes] = await Promise.all([
        adminInventoryApi.getAll(),
        adminInventoryApi.getLogs(50),
        adminInventoryApi.getStats(),
      ]);
      setIngredients(ingredientsRes.ingredients);
      setLogs(logsRes.logs);
      setStats(statsRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleAddIngredient = async () => {
    if (!newIngredient.name || !newIngredient.unit) { setError('Vui lòng điền đầy đủ tên và đơn vị'); return; }
    setSubmitting(true); setError('');
    try {
      await adminInventoryApi.create(newIngredient);
      await loadAll();
      setShowAddIngredient(false);
      setNewIngredient({ name: '', unit: '', stock: 0, minThreshold: 0 });
      showSuccess('Đã thêm nguyên liệu mới!');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi khi thêm nguyên liệu');
    } finally { setSubmitting(false); }
  };

  const handleEditIngredient = async () => {
    if (!editIngredient) return;
    if (!editForm.name || !editForm.unit) { setError('Vui lòng điền đầy đủ tên và đơn vị'); return; }
    setSubmitting(true); setError('');
    try {
      await adminInventoryApi.update(editIngredient._id, editForm);
      await loadAll();
      setEditIngredient(null);
      showSuccess('Đã cập nhật nguyên liệu!');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi khi cập nhật');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xoá nguyên liệu "${name}"?`)) return;
    try {
      await adminInventoryApi.delete(id);
      await loadAll();
      showSuccess(`Đã xoá "${name}"`);
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Lỗi khi xoá'); }
  };

  const openModal = (ingredient: Ingredient, type: 'import' | 'export' | 'spoilage') => {
    setSelectedIngredient(ingredient); setModalType(type);
    setQuantity(0); setReason(''); setError(''); setModalOpen(true);
  };

  const handleAction = async () => {
    if (!selectedIngredient) return;
    if (quantity <= 0) { setError('Số lượng phải lớn hơn 0'); return; }
    setSubmitting(true); setError('');
    try {
      await adminInventoryApi.movement(selectedIngredient._id, { type: modalType, quantity, reason });
      await loadAll();
      setModalOpen(false); setSelectedIngredient(null);
      const label = modalType === 'import' ? 'Nhập' : modalType === 'export' ? 'Xuất' : 'Hủy';
      showSuccess(`${label} ${quantity} ${selectedIngredient.unit} ${selectedIngredient.name} thành công`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi khi thực hiện');
    } finally { setSubmitting(false); }
  };

  const getLogBadge = (type: string) => ({
    import: 'bg-green-100 text-green-800',
    export: 'bg-blue-100 text-blue-800',
    spoilage: 'bg-red-100 text-red-800',
  }[type] ?? 'bg-gray-100 text-gray-800');

  const getLogLabel = (type: string) => ({ import: 'Nhập kho', export: 'Xuất kho', spoilage: 'Hủy / Hao hụt' }[type] ?? '');
  const getLogIcon = (type: string) => type === 'import'
    ? <Plus className="w-3 h-3" />
    : type === 'export'
    ? <Minus className="w-3 h-3" />
    : <Trash2 className="w-3 h-3" />;

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-64">
        <div className="w-9 h-9 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div className="p-6 bg-gray-50 min-h-screen">

        {successMsg && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
            {successMsg}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý kho</h1>
            <p className="text-gray-500 text-sm mt-1">Nguyên liệu, nhập / xuất / hủy kho</p>
          </div>
          <button onClick={loadAll} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 border rounded-lg px-3 py-2 bg-white hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Tổng nguyên liệu', value: stats?.total ?? ingredients.length, icon: <Package className="w-9 h-9 text-purple-400" /> },
            { label: 'Sắp hết hàng', value: stats?.lowStock ?? ingredients.filter(i => i.stock <= i.minThreshold).length, icon: <AlertCircle className="w-9 h-9 text-orange-400" />, red: true },
            { label: 'Giao dịch hôm nay', value: stats?.todayTransactions ?? 0, icon: <History className="w-9 h-9 text-blue-400" /> },
          ].map(({ label, value, icon, red }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className={`text-2xl font-bold ${red ? 'text-orange-500' : 'text-gray-800'}`}>{value}</p>
              </div>
              {icon}
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4 flex justify-between items-center">
          <button onClick={() => { setShowAddIngredient(true); setError(''); }} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Thêm nguyên liệu
          </button>
          <p className="text-xs text-gray-400">⚠ Hàng đỏ: tồn kho dưới ngưỡng cảnh báo</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Nguyên liệu', 'Đơn vị', 'Tồn kho', 'Ngưỡng cảnh báo', 'Thao tác'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ingredients.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Chưa có nguyên liệu nào. Hãy thêm mới!</td></tr>
                ) : ingredients.map(ing => {
                  const low = ing.stock <= ing.minThreshold;
                  return (
                    <tr key={ing._id} className={`hover:bg-gray-50 ${low ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {low && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          <span className={`font-medium ${low ? 'text-red-700' : 'text-gray-900'}`}>{ing.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{ing.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold text-lg ${low ? 'text-red-600' : 'text-gray-900'}`}>{ing.stock}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{ing.minThreshold}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button onClick={() => openModal(ing, 'import')} className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-xs font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Nhập
                          </button>
                          <button onClick={() => openModal(ing, 'export')} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition text-xs font-medium flex items-center gap-1">
                            <Minus className="w-3 h-3" /> Xuất
                          </button>
                          <button onClick={() => openModal(ing, 'spoilage')} className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition text-xs font-medium flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Hủy
                          </button>
                          <button onClick={() => { setEditIngredient(ing); setEditForm({ name: ing.name, unit: ing.unit, minThreshold: ing.minThreshold }); setError(''); }} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition text-xs font-medium flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Sửa
                          </button>
                          <button onClick={() => handleDelete(ing._id, ing.name)} className="text-red-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" /> Lịch sử nhập / xuất / hủy gần đây
            </h2>
            <span className="text-xs text-gray-400">{logs.length} giao dịch</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Thời gian', 'Nguyên liệu', 'Loại', 'Số lượng', 'Lý do', 'Người thực hiện'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">Chưa có giao dịch nào</td></tr>
                ) : logs.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 text-sm">{log.ingredientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getLogBadge(log.type)}`}>
                        {getLogIcon(log.type)} {getLogLabel(log.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm font-medium">
                      {log.quantity}
                      {typeof log.ingredient === 'object' && log.ingredient !== null ? ` ${(log.ingredient as { unit: string }).unit}` : ''}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{log.reason || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {typeof log.createdBy === 'object' && log.createdBy !== null ? (log.createdBy as { displayName: string }).displayName : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Thêm */}
        {showAddIngredient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">Thêm nguyên liệu mới</h2>
                <button onClick={() => setShowAddIngredient(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-3">
                {([['name','Tên nguyên liệu *','VD: Bột mì','text'],['unit','Đơn vị *','kg, lít, quả...','text'],['stock','Tồn kho ban đầu','0','number'],['minThreshold','Ngưỡng cảnh báo','0','number']] as [keyof typeof newIngredient, string, string, string][]).map(([key,label,ph,type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} placeholder={ph} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      value={newIngredient[key]}
                      onChange={e => setNewIngredient({...newIngredient, [key]: type==='number' ? parseFloat(e.target.value)||0 : e.target.value})} />
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex gap-2 mt-5">
                <button onClick={handleAddIngredient} disabled={submitting} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium disabled:opacity-50">{submitting ? 'Đang lưu...' : 'Thêm'}</button>
                <button onClick={() => setShowAddIngredient(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sửa */}
        {editIngredient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">Sửa nguyên liệu</h2>
                <button onClick={() => setEditIngredient(null)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị *</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngưỡng cảnh báo</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" value={editForm.minThreshold} onChange={e => setEditForm({...editForm, minThreshold: parseFloat(e.target.value)||0})} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex gap-2 mt-5">
                <button onClick={handleEditIngredient} disabled={submitting} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium disabled:opacity-50">{submitting ? 'Đang lưu...' : 'Cập nhật'}</button>
                <button onClick={() => setEditIngredient(null)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nhập/Xuất/Hủy */}
        {modalOpen && selectedIngredient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {modalType === 'import' && `Nhập kho: ${selectedIngredient.name}`}
                  {modalType === 'export' && `Xuất kho: ${selectedIngredient.name}`}
                  {modalType === 'spoilage' && `Hủy / Hao hụt: ${selectedIngredient.name}`}
                </h2>
                <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Tồn kho hiện tại: <span className="font-semibold text-gray-800">{selectedIngredient.stock} {selectedIngredient.unit}</span></p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng ({selectedIngredient.unit}) *</label>
                  <input type="number" step="any" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" value={quantity || ''} onChange={e => setQuantity(parseFloat(e.target.value)||0)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lý do {modalType === 'spoilage' && <span className="text-red-500">*</span>}</label>
                  <input type="text" placeholder={modalType==='import'?'Nhập từ nhà cung cấp...':modalType==='export'?'Dùng làm bánh...':'Hết hạn, hư hỏng...'} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" value={reason} onChange={e => setReason(e.target.value)} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex gap-2 mt-5">
                <button onClick={handleAction} disabled={submitting} className={`flex-1 text-white py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${modalType==='import'?'bg-green-500 hover:bg-green-600':modalType==='export'?'bg-blue-500 hover:bg-blue-600':'bg-orange-500 hover:bg-orange-600'}`}>
                  {submitting ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  );
}