// src/components/CategoryGroup.jsx
import { Link } from "react-router-dom";

export default function CategoryGroup({ title, items }) {
  return (
    <div className="mb-6">
      {/* Tiêu đề nhóm */}
      <h3 className="text-sm font-semibold text-slate-200 mb-2 tracking-wide uppercase">
        {title}
      </h3>

      {/* Danh sách danh mục con */}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/products?type=${encodeURIComponent(item.name)}`}
              className="block px-3 py-1 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}