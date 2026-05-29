import React, { useState } from "react";
import { useItems } from "../hooks/useItems";
import { useClaims } from "../hooks/useItems";
import StatusBadge from "../components/statusBadge";
import { TYPE_EMOJI } from "../constants";
import { useAuth } from "../context/AuthContext";

const FILTERS = ["All", "Lost", "Found"];

export default function AllItems() {
  const { auth } = useAuth();
  const { items, loading, refetch } = useItems();
  const { submitClaim } = useClaims();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [claimMsg, setClaimMsg] = useState({});

  async function handleClaim(itemId) {
    try {
      await submitClaim(itemId);
      setClaimMsg((p) => ({ ...p, [itemId]: "✓ Claim submitted!" }));
      refetch();
    } catch (err) {
      setClaimMsg((p) => ({ ...p, [itemId]: err.response?.data?.message || "Error submitting claim" }));
    }
    setTimeout(() => setClaimMsg((p) => ({ ...p, [itemId]: "" })), 3000);
  }

  const filtered = items
    .filter((i) => filter === "All" || i.Type === filter)
    .filter((i) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        i.ItemName?.toLowerCase().includes(q) ||
        i.Description?.toLowerCase().includes(q) ||
        i.PostedByName?.toLowerCase().includes(q)
      );
    });

  if (loading) return <p className="text-stone-400 text-sm mt-8 text-center">Loading…</p>;

  return (
    <div>
      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all
              ${filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
              }`}
          >
            {f}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍Search items…"
          className="ml-auto px-3 py-1.5 rounded-full border border-stone-200 bg-white text-[12px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 transition-all"
        />
      </div>
      <p style={{fontSize:1, color:'white'}}>
      {auth?.userId}" | role: "{auth?.role}
        </p>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-200 rounded-xl text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-semibold text-stone-700 text-sm">No items found</p>
            <p className="text-xs text-stone-400 mt-1">
              {search ? "Try a different search term." : "No items in this category."}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.ItemID} className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 flex items-start gap-3 shadow-sm hover:border-stone-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                {TYPE_EMOJI[item.Type] || "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-stone-900 truncate">{item.ItemName}</p>
                {item.Description && (
                  <p className="text-[12px] text-stone-400 mt-0.5 truncate">{item.Description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                  <StatusBadge label={item.Type} />
                  <StatusBadge label={item.Status} />
                  <span className="text-[11px] text-stone-400">
                    by {item.PostedByName || "Unknown"} · {new Date(item.DatePosted).toLocaleDateString("en-GB")}
                  </span>
                </div>
                {claimMsg[item.ItemID] && (
                  <p className="text-[12px] text-blue-600 font-medium mt-1">{claimMsg[item.ItemID]}</p>
                )}
              </div>

              {item.Status === "Available" && String (item.PostedBy) !== String (auth?.userId) && (
                <button
                  onClick={() => handleClaim(item.ItemID)}
                  className="flex-shrink-0 text-[12px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all mt-1"
                >
                  Claim
                </button>
              )}
            </div>

          ))
        )}
      </div>
    </div>
  );
}
