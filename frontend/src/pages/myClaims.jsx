import React from "react";
import { useClaims } from "../hooks/useItems";
import StatusBadge from "../components/statusBadge";
import { TYPE_EMOJI } from "../constants";

export default function MyClaims() {
  const { claims, loading, error } = useClaims();

  if (loading) return <p className="text-stone-400 text-sm mt-8 text-center">Loading…</p>;
  if (error)   return <p className="text-red-500 text-sm mt-8 text-center">{error}</p>;

  return (
    <div>
      <p className="text-[13px] text-stone-400 mb-4">
        {claims.length} claim{claims.length !== 1 ? "s" : ""} submitted by you
      </p>

      <div className="flex flex-col gap-2">
        {claims.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-200 rounded-xl text-center py-12">
            <p className="text-2xl mb-2">📬</p>
            <p className="font-semibold text-stone-700 text-sm">No claims yet</p>
            <p className="text-xs text-stone-400 mt-1">
              Browse All Items and click "Claim" to submit one.
            </p>
          </div>
        ) : (
          claims.map((c) => (
            <div key={c.ClaimID} className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm hover:border-stone-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-lg flex-shrink-0">
                {TYPE_EMOJI[c.Type] || "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-stone-900 truncate">{c.ItemName}</p>
                <p className="text-[12px] text-stone-400 mt-0.5">
                  Claimed on {new Date(c.DateClaimed).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge label={c.Type} />
                <StatusBadge label={c.Approved} />
              </div>
            </div>
          ))
        )}
      </div>

      {claims.length > 0 && (
        <div className="mt-6 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Status guide</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Pending",  desc: "Waiting for admin review" },
              { label: "Approved", desc: "Claim accepted — collect your item" },
              { label: "Rejected", desc: "Claim was not approved" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center gap-1.5 text-[12px] text-stone-500">
                <StatusBadge label={label} />
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
