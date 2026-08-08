import { useEffect, useState } from "react";
import PromotionList from "../components/PromotionList";
import PromotionToolbar from "../components/PromotionToolbar";
import PromotionAddModal from "../components/PromotionAddModal";
import PromotionEditModal from "../components/PromotionEditModal";
import Pagination from "../components/Pagination";
import { getPromotions, deletePromotion } from "../services/promotionService";

export default function PromotionsPage() {
  const [promotionsAll, setPromotionsAll] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [searchText, setSearchText] = useState("");

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editPromo, setEditPromo] = useState(null);

  const [sortType, setSortType] = useState("");

  //hàm sắp xếp
  function applySort(list) {
    switch (sortType) {
      case "nameAsc":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));

      case "nameDesc":
        return [...list].sort((a, b) => b.name.localeCompare(a.name));

      case "discountAsc":
        return [...list].sort((a, b) => a.discountPercentage - b.discountPercentage);

      case "discountDesc":
        return [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);

      case "startAsc":
        return [...list].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      case "startDesc":
        return [...list].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      case "endAsc":
        return [...list].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

      case "endDesc":
        return [...list].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

      default:
        return list;
    }
  }


  // 🟦 Load toàn bộ promotions 1 lần
  const loadPromotions = async () => {
    try {
      const data = await getPromotions();
      console.log(">>> DATA:", data);
      setPromotionsAll(data || []);
    } catch (err) {
      console.error("Load promotion failed:", err);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // 🟦 Tính tổng trang sau khi search
  const filteredPromotions = promotionsAll.filter((item) => {
    if (!searchText) return true;

    const first = searchText.trim()[0];

    // tìm theo ID
    if (!isNaN(first)) {
      return item.id.toString().includes(searchText.trim());
    }

    // tìm theo tên
    return item.name.toLowerCase().includes(searchText.toLowerCase());
  });
  
  const totalPages = Math.ceil(filteredPromotions.length / pageSize);

  // 🟦 Cắt dữ liệu theo trang dựa trên danh sách đã lọc
  useEffect(() => {
    let filtered = promotionsAll.filter(item => {
      if (!searchText) return true;

      const first = searchText.trim()[0];

      if (!isNaN(first)) {
        return item.id.toString().includes(searchText.trim());
      }

      return item.name.toLowerCase().includes(searchText.toLowerCase());
    });
    

    // 👉 Áp dụng sort
    filtered = applySort(filtered);

    // 👉 Cắt trang
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    setPromotions(filtered.slice(start, end));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionsAll, searchText, sortType, currentPage]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEdit = (promo) => {
    setEditPromo(promo);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Bạn chưa chọn khuyến mãi nào!");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

    try {
      for (let id of selectedIds) {
        await deletePromotion(id);
      }

      alert("Xóa thành công!");
      setSelectedIds([]);
      loadPromotions();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa!");
    }
  };

  return (
    <div className="space-y-4">
      <PromotionToolbar
        onAddPromotion={() => setShowAddModal(true)}
        onDeletePromotion={handleDelete}
        onSearch={(q) => {
          setSearchText(q);
          setCurrentPage(1); // reset về trang 1
        }}
        onSortChange={(v) => {
          setSortType(v);
          setCurrentPage(1); // reset lại trang
        }}
      />

      <PromotionList
        promotions={promotions}
        onSelect={handleSelect}
        onEdit={handleEdit}
      />

      {/* Add Modal */}
      {showAddModal && (
        <PromotionAddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadPromotions}
        />
      )}

      {/* Edit Modal */}
      {editPromo && (
        <PromotionEditModal
          promotion={editPromo}
          onClose={() => setEditPromo(null)}
          onSuccess={loadPromotions}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
}