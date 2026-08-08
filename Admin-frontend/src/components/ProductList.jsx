// src/components/ProductList.jsx
import ProductItem from "./ProductItem";

export default function ProductList({ products, onEdit, onSelect }) {
  if (!products || products.length === 0)
    return <div className="text-center text-slate-400 mt-10 text-sm">Không có sản phẩm nào</div>;

  return (
    <div className="flex flex-col gap-4">
      {products.map((item) => (
        <ProductItem key={item.id} product={item} onEdit={() => onEdit(item)} onSelect={onSelect} />
      ))}
    </div>
  );
}