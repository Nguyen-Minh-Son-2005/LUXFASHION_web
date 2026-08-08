// src/components/PromotionList.jsx
import PromotionItem from "./PromotionItem";

export default function PromotionList({
  promotions,
  onSelect,
  onEdit
}) {
  return (
    <div className="bg-slate-950/70 rounded-2xl border border-slate-800 shadow-sm p-4 space-y-2">
      {promotions.map((promo) => (
        <PromotionItem
          key={promo.id}
          promo={promo}
          onSelect={onSelect}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}