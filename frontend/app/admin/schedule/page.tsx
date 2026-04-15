'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Calendar,
  Download,
  Plus,
  Trash2,
  Filter,
  X,
  Search,
  Edit,
  ChevronLeft,
  ChevronRight,
  Upload,
  Save,
} from 'lucide-react';
import AdminShell from '../components/AdminShell';

// Định nghĩa kiểu nhân viên
type Staff = {
  id: number;
  msnv: number;
  fullName: string;
  position: string;
  role: string;
  schedule: Record<string, string>;
};

// Dữ liệu mẫu (3 nhân viên)
const initialStaffs: Staff[] = [
  {
    id: 1,
    msnv: 1,
    fullName: 'Huỳnh Chí Danh',
    position: 'CL2MS',
    role: '15-23',
    schedule: {
      '2026-04-13': '-',
      '2026-04-14': '10-18',
      '2026-04-15': '-',
      '2026-04-16': '07-15',
      '2026-04-17': 'Training',
      '2026-04-18': '-',
      '2026-04-19': '07-15',
    },
  },
  {
    id: 2,
    msnv: 2,
    fullName: 'Tạ Hoàng Gia Hiếu',
    position: 'CL2MS',
    role: '07-15',
    schedule: {
      '2026-04-13': '-',
      '2026-04-14': '15-23',
      '2026-04-15': '-',
      '2026-04-16': '07-15',
      '2026-04-17': '-',
      '2026-04-18': '15-23',
      '2026-04-19': '07-15',
    },
  },
  {
    id: 3,
    msnv: 3,
    fullName: 'Nguyễn Anh Tuấn',
    position: 'CL2MS',
    role: '07-15',
    schedule: {
      '2026-04-13': '-',
      '2026-04-14': '15-23',
      '2026-04-15': '-',
      '2026-04-16': '15-23',
      '2026-04-17': '-',
      '2026-04-18': '15-23',
      '2026-04-19': '',
    },
  },
];

const dateRange = [
  '2026-04-13',
  '2026-04-14',
  '2026-04-15',
  '2026-04-16',
  '2026-04-17',
  '2026-04-18',
  '2026-04-19',
];
const dateLabels = [
  'thứ 2',
  'thứ 3',
  'thứ 4',
  'thứ 5',
  'thứ 6',
  'thứ 7',
  'Chủ nhật',
];

const shiftOptions = [
  '-', '06-10', '06-12', '06-15', '07-12', '07-15',
  '10-15', '10-18', '12-18', '15-23', '18-23', 'Training', 'Off',
];

// Component hiển thị badge cho ca làm việc
const ShiftBadge = ({ shift }: { shift: string }) => {
  const getColor = () => {
    if (shift === 'Training') return 'bg-orange-100 text-orange-700';
    if (shift === 'Off') return 'bg-red-100 text-red-700';
    if (shift === '-') return 'bg-gray-100 text-gray-500';
    return 'bg-blue-100 text-blue-700';
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {shift}
    </span>
  );
};

export default function StaffSchedulePage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filterPosition, setFilterPosition] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<{ staff: Staff; date: string } | null>(null);
  const [tempShift, setTempShift] = useState('');
  const itemsPerPage = 5;

  // Load data
  useEffect(() => {
    const stored = localStorage.getItem('staff_schedule');
    if (stored) setStaffs(JSON.parse(stored));
    else setStaffs(initialStaffs);
  }, []);

  useEffect(() => {
    if (staffs.length) localStorage.setItem('staff_schedule', JSON.stringify(staffs));
  }, [staffs]);

  // Lọc và tìm kiếm
  const filteredStaffs = staffs.filter(s => {
    const matchPosition = filterPosition === 'all' || s.position === filterPosition;
    const matchSearch = searchKeyword === '' || 
      s.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      s.msnv.toString().includes(searchKeyword);
    return matchPosition && matchSearch;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const paginatedStaffs = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Cập nhật ca
  const updateShift = (staffId: number, date: string, newShift: string) => {
    setStaffs(prev => prev.map(s => 
      s.id === staffId ? { ...s, schedule: { ...s.schedule, [date]: newShift } } : s
    ));
    setEditingSchedule(null);
  };

  // Xoá nhân viên
  const deleteStaff = (id: number) => {
    if (confirm('Xoá nhân viên này?')) {
      setStaffs(prev => prev.filter(s => s.id !== id));
      if (editingStaff?.id === id) setEditingStaff(null);
    }
  };

  // Thêm nhân viên
  const addStaff = (newStaffData: Omit<Staff, 'id'>) => {
    const maxId = Math.max(...staffs.map(s => s.id), 0);
    const staffToAdd: Staff = { ...newStaffData, id: maxId + 1 };
    setStaffs([...staffs, staffToAdd]);
    setIsAddingStaff(false);
  };

  // Cập nhật thông tin nhân viên
  const updateStaffInfo = (updatedStaff: Staff) => {
    setStaffs(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    setEditingStaff(null);
  };

  // Xuất Excel
  const exportToExcel = () => {
    const exportData = filteredStaffs.map(s => ({
      MSNV: s.msnv,
      'HỌ VÀ TÊN': s.fullName,
      'Vị trí': s.position,
      'Chức vụ': s.role,
      ...Object.fromEntries(dateLabels.map((label, idx) => [label, s.schedule[dateRange[idx]] || '-']))
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch làm việc');
    XLSX.writeFile(wb, `lich_lam_viec_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <AdminShell>
      <div className="min-h-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lịch làm việc</h1>
              <p className="text-gray-500 text-sm">Quản lý ca làm việc của nhân viên</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportToExcel} className="flex items-center gap-2 bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition shadow-sm">
              <Download className="h-4 w-4" /> Xuất Excel
            </button>
            <button onClick={() => setIsAddingStaff(true)} className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition shadow-sm">
              <Plus className="h-4 w-4" /> Thêm nhân viên
            </button>
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc MSNV..."
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterPosition}
              onChange={(e) => { setFilterPosition(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả chức vụ</option>
              <option value="QLLY1">QLLY1</option><option value="GS">GS</option>
              <option value="FTLY1">FTLY1</option><option value="CL2MS">CL2MS</option>
              <option value="CL1MS">CL1MS</option>
            </select>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">MSNV</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Họ tên</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Chức vụ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Vị trí</th>
                  {dateLabels.map(label => (
                    <th key={label} className="px-2 py-3 text-center text-sm font-semibold text-gray-600">{label}</th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStaffs.map(staff => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition group">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{staff.msnv}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{staff.fullName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{staff.position}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{staff.role}</td>
                    {dateRange.map(date => {
                      const shift = staff.schedule[date] || '-';
                      return (
                        <td key={date} className="px-2 py-2 text-center">
                          <button
                            onClick={() => { setEditingSchedule({ staff, date }); setTempShift(shift); }}
                            className="hover:scale-105 transition-transform"
                          >
                            <ShiftBadge shift={shift} />
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition">
                        <button onClick={() => setEditingStaff(staff)} className="text-blue-500 hover:text-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteStaff(staff.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginatedStaffs.length === 0 && (
            <div className="text-center py-12 text-gray-400">Không có nhân viên nào</div>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Hiển thị {(currentPage-1)*itemsPerPage+1} đến {Math.min(currentPage*itemsPerPage, filteredStaffs.length)} trong {filteredStaffs.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 border rounded-lg disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 border rounded-lg bg-gray-50">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 border rounded-lg disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal thêm nhân viên */}
        {isAddingStaff && (
          <StaffFormModal
            title="Thêm nhân viên"
            onSave={(data) => addStaff({ ...data, schedule: Object.fromEntries(dateRange.map(d => [d, '-'])) })}
            onClose={() => setIsAddingStaff(false)}
            dateRange={dateRange}
          />
        )}

        {/* Modal chỉnh sửa thông tin nhân viên */}
        {editingStaff && (
          <StaffFormModal
            title="Chỉnh sửa nhân viên"
            initialData={editingStaff}
            onSave={(data) => updateStaffInfo({ ...data, id: editingStaff.id, schedule: editingStaff.schedule })}
            onClose={() => setEditingStaff(null)}
            dateRange={dateRange}
          />
        )}

        {/* Modal chỉnh sửa ca làm việc */}
        {editingSchedule && (
          <ShiftEditModal
            staff={editingSchedule.staff}
            date={editingSchedule.date}
            currentShift={tempShift}
            shiftOptions={shiftOptions}
            onSave={(newShift) => updateShift(editingSchedule.staff.id, editingSchedule.date, newShift)}
            onClose={() => setEditingSchedule(null)}
          />
        )}
      </div>
    </AdminShell>
  );
}

// Modal cho form nhân viên (thêm/sửa)
function StaffFormModal({ title, initialData, onSave, onClose, dateRange }: any) {
  const [form, setForm] = useState({
    msnv: initialData?.msnv || 0,
    fullName: initialData?.fullName || '',
    position: initialData?.position || 'CL2MS',
    role: initialData?.role || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.msnv) return alert('Vui lòng nhập đầy đủ');
    onSave({ ...form, schedule: initialData?.schedule || {} });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <input type="number" placeholder="MSNV *" value={form.msnv || ''} onChange={e => setForm({...form, msnv: parseInt(e.target.value) || 0})} className="w-full border rounded-lg p-2" required />
          <input type="text" placeholder="Họ và tên *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full border rounded-lg p-2" required />
          <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full border rounded-lg p-2">
            <option value="QLLY1">QLLY1</option><option value="GS">GS</option>
            <option value="FTLY1">FTLY1</option><option value="CL2MS">CL2MS</option><option value="CL1MS">CL1MS</option>
          </select>
          <input type="text" placeholder="Chức vụ (ca mặc định)" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border rounded-lg p-2" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Huỷ</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal chỉnh sửa ca làm việc
function ShiftEditModal({ staff, date, currentShift, shiftOptions, onSave, onClose }: any) {
  const [shift, setShift] = useState(currentShift);
  const dateLabel = new Date(date).toLocaleDateString('vi-VN');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Chỉnh sửa ca làm việc</h3>
          <p className="text-sm text-gray-500">{staff.fullName} - {dateLabel}</p>
        </div>
        <div className="p-5">
          <select value={shift} onChange={e => setShift(e.target.value)} className="w-full border rounded-lg p-2 mb-4">
            {shiftOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">Huỷ</button>
            <button onClick={() => onSave(shift)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}