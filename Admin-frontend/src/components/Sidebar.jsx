// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { getCategories } from "../services/productService";
import CategoryGroup from "./CategoryGroup";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  // 🔹 Tạo các nhóm rỗng ban đầu
  const groups = {
    "Áo": [],
    "Găng": [],
    "Dép": [],
    "Mũ": [],
    "Quần": [],
    "Phụ kiện": [],
    "Túi xách": [],
  };

  // 🔹 Phân loại danh mục theo id
  categories.forEach((cat) => {
    const id = Number(cat.id);

    if (id >= 1 && id <= 7) groups["Áo"].push(cat);
    else if (id >= 8 && id <= 10) groups["Găng"].push(cat);
    else if (id >= 11 && id <= 15) groups["Dép"].push(cat);
    else if (id >= 16 && id <= 19) groups["Mũ"].push(cat);
    else if (id >= 20 && id <= 23) groups["Quần"].push(cat);
    else if (id >= 24 && id <= 27) groups["Phụ kiện"].push(cat);
    else groups["Túi xách"].push(cat);
  });

  return (
    <aside className="hidden lg:block lg:w-72 xl:w-80 h-[calc(100vh-7rem)]">
      <div className="h-full rounded-3xl border border-slate-800 bg-slate-950/70 shadow-[0_18px_45px_rgba(15,23,42,0.85)] px-4 py-5 overflow-y-auto backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
            Kho hàng
          </h2>
        </div>

        <div className="space-y-3">
          {Object.keys(groups).map((group) =>
            groups[group].length > 0 ? (
              <CategoryGroup key={group} title={group} items={groups[group]} />
            ) : null
          )}
        </div>
      </div>
    </aside>
  );
}