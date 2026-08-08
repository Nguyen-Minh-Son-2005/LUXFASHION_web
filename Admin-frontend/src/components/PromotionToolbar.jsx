import Toolbar from "./Toolbar";

export default function PromotionToolbar({
  onAddPromotion,
  onDeletePromotion,
  onSearch,
  onSortChange,
}) {
  const sortOptions = [
    { value : "", label: "Mặc định" },
    { value: "nameAsc", label: "Tên A → Z" },
    { value: "nameDesc", label: "Tên Z → A" },
    { value: "discountAsc", label: "Giảm giá tăng dần" },
    { value: "discountDesc", label: "Giảm giá giảm dần" },
    { value: "startAsc", label: "Ngày bắt đầu ↑" },
    { value: "startDesc", label: "Ngày bắt đầu ↓" },
    { value: "endAsc", label: "Ngày kết thúc ↑" },
    { value: "endDesc", label: "Ngày kết thúc ↓" },
  ];

  return (
    <Toolbar
      title="Quản lý khuyến mãi"
      onAdd={onAddPromotion}
      onDelete={onDeletePromotion}
      onSearch={onSearch}
      onSortChange={onSortChange}
      sortOptions={sortOptions}
      searchPlaceholder="số đầu-theo mã; chữ đầu-theo tên"
    />
  );
}