import React from "react";

export default function StatCard({ label, value, sub, color = "text-stone-900" }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className={`text-[28px] font-semibold leading-none tracking-tighter ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}
