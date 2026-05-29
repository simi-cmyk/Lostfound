import React, { useState } from "react";
import { useClaims } from "../hooks/useItems";
import StatusBadge from "../components/statusBadge";
import StatCard from "../components/statCard";
import { TYPE_EMOJI } from "../constants";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function AdminClaims() {
  const { claims, loading, error, stats, approveClaim, deleteClaim } = useClaims();
  const [filter, setFilter] = useState("All");
  const [busy, setBusy]     = useState({});
  const [msg, setMsg]       = useState({});

  async function decide(ClaimID, decision) {
    setBusy((p) => ({ ...p, [ClaimID]: true }));
    try {
      await approveClaim(ClaimID, decision);
      setMsg((p) => ({ ...p, [ClaimID]: decision }));
    } catch (err) {
      setMsg((p) => ({ ...p, [ClaimID]: err.response?.data?.message || "Error" }));
    } finally {
      setBusy((p) => ({ ...p, [ClaimID]: false }));
      setTimeout(() => setMsg((p) => ({ ...p, [ClaimID]: "" })), 3000);
    }
  }

  async function handleDelete(ClaimID) {
    if (!window.confirm("Delete this claim permanently?")) return;
    try { await deleteClaim(ClaimID); }
    catch (err) { alert(err.response?.data?.message || "Failed to delete."); }
  }

  const filtered = filter === "All" ? claims : claims.filter((c) => c.Approved === filter);

  if (loading) return <p className="text-stone-400 text-sm mt-8 text-center">Loading…</p>;
  if (error)   return <p className="text-red-500 text-sm mt-8 text-center">{error}</p>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Pending"  value={stats.pending}  sub="need decision" color="text-amber-600" />
        <StatCard label="Approved" value={stats.approved} sub="resolved"      color="text-green-700" />
        <StatCard label="Rejected" value={stats.rejected} sub="declined"      color="text-red-600" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all
              ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Claims list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-200 rounded-xl text-center py-12">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold text-stone-700 text-sm">No claims here</p>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.ClaimID} className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-lg flex-shrink-0">
                  {TYPE_EMOJI[c.Type] || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-stone-900">{c.ItemName}</p>
                  <p className="text-[12px] text-stone-400 mt-0.5">
                    Claimed by <span className="font-semibold text-stone-600">{c.ClaimedByName}</span>
                    {" · "}{new Date(c.DateClaimed).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <div className="flex gap-2 mt-1.5">
                    <StatusBadge label={c.Type} />
                    <StatusBadge label={c.Approved} />
                  </div>
                  {msg[c.ClaimID] && (
                    <p className={`text-[12px] font-medium mt-1 ${msg[c.ClaimID] === "Approved" ? "text-green-600" : "text-red-600"}`}>
                      {msg[c.ClaimID] === "Approved" ? "✓ Approved" : msg[c.ClaimID] === "Rejected" ? "✗ Rejected" : msg[c.ClaimID]}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0 items-start mt-0.5">
                  {c.Approved === "Pending" && (
                    <>
                      <button onClick={() => decide(c.ClaimID, "Approved")} disabled={busy[c.ClaimID]}
                        className="text-[12px] font-semibold text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
                        Approve
                      </button>
                      <button onClick={() => decide(c.ClaimID, "Rejected")} disabled={busy[c.ClaimID]}
                        className="text-[12px] font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
                        Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(c.ClaimID)}
                    className="text-[12px] text-stone-400 hover:text-red-500 border border-stone-200 hover:border-red-200 bg-stone-50 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-all" title="Delete">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
