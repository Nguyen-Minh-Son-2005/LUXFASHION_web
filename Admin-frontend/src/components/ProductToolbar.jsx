import Toolbar from "./Toolbar";

export default function ProductToolbar({
  onAddProduct,
  onDeleteProduct,
  onSearchProduct,
  onSortChange,
}) {
  const sortOptions = [
    { value: "idAsc", label: "Mã tăng dần" },
    { value: "idDesc", label: "Mã giảm dần" },
    { value: "nameAsc", label: "Tăng dần theo tên" },
    { value: "nameDesc", label: "Giảm dần theo tên" },
    { value: "priceAsc", label: "Giá tăng dần" },
    { value: "priceDesc", label: "Giá giảm dần" },
    { value: "rateAsc", label: "Đánh giá tăng dần" },
    { value: "rateDesc", label: "Đánh giá giảm dần" },
  ];

  return (
    <Toolbar
      title="Quản lý sản phẩm"
      onAdd={onAddProduct}
      onDelete={onDeleteProduct}
      onSearch={onSearchProduct}
      onSortChange={onSortChange}
      sortOptions={sortOptions}
      searchPlaceholder="Tìm theo mã, tên..."
    />
  );
}