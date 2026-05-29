import React, { useEffect, useState } from "react";
import api from "../api";
import StatusBadge from "../components/statusBadge";

export default function AdminItems() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  function fetchItems() {
    api.get("/")
      .then((r) => setItems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this item and all its claims?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  }

  async function toggleStatus(item) {
    const newStatus = item.Status === "Available" ? "Closed" : "Available";
    try {
      await api.put(`/items/${item.ItemID}`, { ...item, Status: newStatus });
      fetchItems();
    } catch (err) {
      alert("Failed to update status.");
    }
  }

  const FILTERS = ["All", "Open", "Claimed", "Closed"];
  const filtered = items
    .filter((i) => filter === "All" || i.Status === filter)
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
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total",   val: items.length, color: "text-stone-900" },
          { label: "Open",    val: items.filter((i) => i.Status === "Open").length,    color: "text-blue-600" },
          { label: "Claimed", val: items.filter((i) => i.Status === "Claimed").length, color: "text-amber-600" },
          { label: "Closed",  val: items.filter((i) => i.Status === "Closed").length,  color: "text-stone-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className={`text-[24px] font-semibold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
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
          placeholder="Search…"
          className="ml-auto px-3 py-1.5 rounded-full border border-stone-200 bg-white text-[12px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 transition-all"
        />
      </div>

      {/* Items table */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-200 rounded-xl text-center py-12">
            <p className="text-2xl mb-2">🗂️</p>
            <p className="font-semibold text-stone-700 text-sm">No items found</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.ItemID}
              className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 flex items-start gap-3 shadow-sm hover:border-stone-300 transition-all"
            >
              {/* ID badge */}
              <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-mono font-bold text-stone-400">#{item.ItemID}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-stone-900 truncate">{item.ItemName}</p>
                {item.Description && (
                  <p className="text-[12px] text-stone-400 truncate mt-0.5">{item.Description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                  <StatusBadge label={item.Type} />
                  <StatusBadge label={item.Status} />
                  <span className="text-[11px] text-stone-400">
                    by {item.PostedByName || "Unknown"} · {new Date(item.DatePosted).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0 mt-1">
                <button
                  onClick={() => toggleStatus(item)}
                  className="text-[12px] font-medium text-stone-500 border border-stone-200 bg-stone-50 hover:bg-white px-3 py-1.5 rounded-lg transition-all"
                >
                  {item.Status === "Open" ? "Close" : "Re-open"}
                </button>
                <button
                  onClick={() => handleDelete(item.ItemID)}
                  className="text-[12px] font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-all"
                  title="Delete item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
