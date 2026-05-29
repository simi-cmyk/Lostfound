import React from "react";
import { useItems } from "../hooks/useItems";
import { useClaims } from "../hooks/useItems";
import StatCard from "../components/statCard";
import StatusBadge from "../components/statusBadge";
import { TYPE_EMOJI } from "../constants";

export default function Dashboard({ setPage }) {
  const { items, loading: itemsLoading, stats } = useItems();
  const { stats: claimStats } = useClaims();

  const recent = [...items].slice(0, 6);

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <div className="text-stone-400 text-sm">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <StatCard label="Total Items"    value={stats.total}         sub="all reports"    color="text-stone-900" />
        <StatCard label="Lost"           value={stats.lost}          sub="reported lost"  color="text-red-600" />
        <StatCard label="Found"          value={stats.found}         sub="reported found" color="text-green-700" />
        <StatCard label="Pending Claims" value={claimStats.pending}  sub="need approval"  color="text-amber-600" />
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Open"    value={stats.open}    sub="available"  color="text-blue-600" />
        <StatCard label="Claimed" value={stats.claimed} sub="processing" color="text-amber-600" />
        <StatCard label="Closed"  value={stats.closed}  sub="resolved"   color="text-stone-500" />
      </div>

      {/* Recent items */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-stone-400">
          Recent Reports
        </h2>
        <button
          onClick={() => setPage("items")}
          className="text-[12px] font-medium text-stone-500 border border-stone-200 bg-stone-50 hover:bg-white px-3 py-1 rounded-lg transition-all"
        >
          View all →
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {recent.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-200 rounded-xl text-center py-12">
            <p className="text-3xl mb-2">📋</p>
            <p className="font-semibold text-stone-700 text-sm mb-1">No items yet</p>
            <p className="text-xs text-stone-400">Use "Report Item" to log the first entry.</p>
          </div>
        ) : (
          recent.map((item) => (
            <div
              key={item.ItemID}
              className="bg-white border border-stone-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm hover:border-stone-300 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-50 flex items-center justify-center text-base flex-shrink-0">
                {TYPE_EMOJI[item.Type] || "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-stone-900 truncate">{item.ItemName}</p>
                <p className="text-[12px] text-stone-400 truncate">
                  {item.Description || "No description"} · by {item.PostedByName || "Unknown"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge label={item.Type} />
                <StatusBadge label={item.Status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
