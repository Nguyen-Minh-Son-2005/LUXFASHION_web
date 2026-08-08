import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, Save, XCircle } from "lucide-react"; // Icon
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../services/supplierService";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Pagination from "../components/Pagination";

export default function SuppliersPage() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [suppliers, setSuppliers] = useState([]); // Danh sách gốc
  const [displayedSuppliers, setDisplayedSuppliers] = useState([]); // Danh sách hiển thị (sau khi search/phân trang)
  const [loading, setLoading] = useState(false);

  // --- STATE TÌM KIẾM & PHÂN TRANG ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số dòng mỗi trang

  // --- STATE THÊM MỚI ---
  const [newSupplierName, setNewSupplierName] = useState("");

  // --- STATE SỬA (INLINE EDIT) ---
  const [editingId, setEditingId] = useState(null); // ID đang sửa
  const [editName, setEditName] = useState(""); // Tên đang sửa

  // --- STATE XÓA ---
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 1. Tải dữ liệu ban đầu
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const data = await getSuppliers();
    // Giả sử API trả về mảng object: [{id: 1, name: "Nike"}, ...]
    // Nếu API trả về { data: [...] } thì sửa thành data.data
    const list = Array.isArray(data) ? data : data.data || [];
    setSuppliers(list);
    setLoading(false);
  };

  // 2. Logic Tìm kiếm & Phân trang (Frontend)
  useEffect(() => {
    let result = [...suppliers];

    // Lọc theo từ khóa (Mã hoặc Tên)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerTerm) ||
          s.id.toString().includes(lowerTerm)
      );
    }

    // Tính toán phân trang
    const totalPages = Math.ceil(result.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = result.slice(startIndex, startIndex + itemsPerPage);

    setDisplayedSuppliers(currentItems);
    
    // Reset về trang 1 nếu search thay đổi
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [suppliers, searchTerm, currentPage]);

  // --- HÀM XỬ LÝ: THÊM ---
  const handleAdd = async () => {
    if (!newSupplierName.trim()) return alert("Vui lòng nhập tên!");
    try {
      await createSupplier(newSupplierName);
      alert("Thêm thành công!");
      setNewSupplierName("");
      fetchSuppliers(); // Reload lại list
    // eslint-disable-next-line no-unused-vars  
    } catch (error) {
      alert("Lỗi khi thêm nhà cung cấp");
    }
  };

  // --- HÀM XỬ LÝ: SỬA (INLINE) ---
  const startEdit = (supplier) => {
    setEditingId(supplier.id);
    setEditName(supplier.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return alert("Tên không được để trống");
    try {
      await updateSupplier(id, editName);
      alert("Cập nhật thành công!");
      setEditingId(null);
      fetchSuppliers();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi khi cập nhật");
    }
  };

  // --- HÀM XỬ LÝ: XÓA ---
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSupplier(deleteId);
      alert("Xóa thành công!");
      setShowDeleteModal(false);
      fetchSuppliers();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi khi xóa (có thể do ràng buộc dữ liệu sản phẩm)");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col space-y-5">
      {/* === HEADER: TIÊU ĐỀ + TÌM KIẾM === */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            Quản lí nhà cung cấp
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi và chỉnh sửa danh sách đối tác cung ứng sản phẩm.
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm theo mã / tên nhà cung cấp"
            className="w-full rounded-full border border-slate-800 bg-slate-950/60 py-2 px-4 pl-10 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
        </div>
      </div>

      {/* === KHU VỰC THÊM MỚI === */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-700">
        <span className="font-semibold text-slate-100 text-sm whitespace-nowrap">
          + Thêm nhà cung cấp
        </span>
        <div className="flex items-center gap-2 w-full max-w-xl">
          <span className="text-slate-400 text-xs">Tên:</span>
          <input
            type="text"
            placeholder="Nhập tên nhà cung cấp..."
            className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-sm bg-slate-900/70 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1 bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 px-4 py-1.5 rounded-xl text-sm font-medium shadow-sm transition"
          >
            <Plus size={14} />
            Thêm
          </button>
        </div>
      </div>

      {/* === BẢNG DANH SÁCH === */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70">
              <th className="p-3 w-1/4 font-semibold text-slate-300">Mã nhà cung cấp</th>
              <th className="p-3 w-1/2 font-semibold text-slate-300">Tên nhà cung cấp</th>
              <th className="p-3 text-right font-semibold text-slate-300">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center p-4 text-slate-400">Đang tải...</td></tr>
            ) : displayedSuppliers.length === 0 ? (
              <tr><td colSpan="3" className="text-center p-4 text-slate-500">Không tìm thấy dữ liệu</td></tr>
            ) : (
              displayedSuppliers.map((item) => (
                <tr key={item.id} className="border-b border-slate-900/60 hover:bg-slate-900/60 transition">
                  {/* Cột Mã */}
                  <td className="p-3 text-slate-300 font-mono text-sm">#{item.id}</td>

                  {/* Cột Tên (Hiển thị hoặc Input sửa) */}
                  <td className="p-3">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-slate-700 rounded-lg px-2 py-1 w-full max-w-xs bg-slate-950/70 text-slate-50 text-sm focus:ring-2 focus:ring-emerald-400/60 outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-slate-50 text-sm">
                        {item.name}
                      </span>
                    )}
                  </td>

                  {/* Cột Hành động */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(item.id)}
                            className="text-emerald-300 hover:text-emerald-200 flex items-center gap-1 text-xs border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 rounded-lg"
                          >
                            <Save size={14} /> Lưu
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-slate-300 hover:text-slate-100 flex items-center gap-1 text-xs border border-slate-600 bg-slate-800/70 px-2.5 py-1 rounded-lg"
                          >
                            <XCircle size={14} /> Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(item)}
                            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-100 px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                          >
                            <Edit2 size={14} /> Sửa tên
                          </button>
                          
                          <button 
                            onClick={() => confirmDelete(item.id)}
                            className="bg-rose-500/10 border border-rose-400/40 hover:bg-rose-500/20 text-rose-300 px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === PHÂN TRANG === */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(suppliers.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* === MODAL XÁC NHẬN XÓA === */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          selectedCount={1}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          message="Bạn có chắc chắn muốn xóa nhà cung cấp này không?"
        />
      )}
    </div>
  );
}