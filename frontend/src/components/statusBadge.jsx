import React from "react";

const CONFIG = {
  Lost:    { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  Found:   { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  Open:    { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  Claimed: { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  Closed:  { bg: "bg-stone-100", text: "text-stone-600",  dot: "bg-stone-400" },
  Pending:  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400" },
  Approved: { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  Rejected: { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
};

export default function StatusBadge({ label }) {
  const cfg = CONFIG[label] || CONFIG["Open"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label}
    </span>
  );
}
