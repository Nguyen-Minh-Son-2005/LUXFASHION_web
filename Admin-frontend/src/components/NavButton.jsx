import { NavLink } from "react-router-dom";

export default function NavButton({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-sm font-medium transition",
          "border border-amber-50 bg-slate-900/70 hover:bg-slate-800/80",
          "shadow-sm hover:shadow-md",
          isActive
            ? "ring-1 ring-emerald-400/70 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            : "hover:border-slate-700",
        ].join(" ")
      }
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-950/70 border border-slate-700 text-slate-100"
          >
            <Icon className="w-4 h-4" />
          </span>
        )}
        <span className="text-slate-100">{label}</span>
      </div>
      <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-[.active]:bg-emerald-400" />
    </NavLink>
  );
}