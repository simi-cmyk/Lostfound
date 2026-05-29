import React from "react";

const TITLES = {
  dashboard:    "Dashboard",
  items:        "All Items",
  report:       "Report Item",
  myclaims:     "My Claims",
  "admin-claims": "Approve Claims",
  "admin-items":  "Manage Items",
};

export default function Topbar({ page, setPage }) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-[5]">
      <h1 className="text-[15px] font-semibold tracking-tight text-stone-900">
        {TITLES[page] || "Dashboard"}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-stone-400 font-mono hidden sm:block">{today}</span>
        <button
          onClick={() => setPage("report")}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold px-3.5 py-1.5 rounded-lg transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
          </svg>
          Report Item
        </button>
      </div>
    </header>
  );
}
