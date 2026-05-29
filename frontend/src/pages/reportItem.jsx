import React, { useState } from "react";
import api from "../api";

const INPUT = "w-full px-3 py-2.5 border border-stone-200 rounded-lg text-[14px] text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
const LABEL = "block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5";

const INIT = { ItemName: "", Description: "", Type: "Lost" };

export default function ReportItem() {
  const [form, setForm]       = useState(INIT);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setError(""); setSuccess(false);
    if (!form.ItemName.trim()) { setError("Item name is required."); return; }
    setLoading(true);
    try {
      await api.post("/items", form);
      setForm(INIT);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium rounded-lg px-4 py-3 mb-5">
          ✓ Item reported successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium rounded-lg px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-[15px] font-semibold text-stone-900 pb-4 mb-5 border-b border-stone-100">
          Report a Lost or Found Item
        </h2>

        {/* Item Name */}
        <div className="mb-4">
          <label className={LABEL}>Item Name <span className="text-red-500">*</span></label>
          <input
            className={INPUT}
            name="ItemName"
            value={form.ItemName}
            onChange={handleChange}
            placeholder="Enter your item name"
          />
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className={LABEL}>Type <span className="text-red-500">*</span></label>
          <div className="flex gap-3">
            {["Lost", "Found"].map((t) => (
              <button
                key={t}
                onClick={() => setForm((p) => ({ ...p, Type: t }))}
                className={`flex-1 py-2.5 rounded-lg border text-[13px] font-semibold transition-all
                  ${form.Type === t
                    ? t === "Lost"
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-green-50 border-green-300 text-green-700"
                    : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-white"
                  }`}
              >
                {t === "Lost" ? "🔍 Lost" : "📦 Found"}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className={LABEL}>Description</label>
          <textarea
            className={`${INPUT} resize-y min-h-[90px] leading-relaxed`}
            name="Description"
            value={form.Description}
            onChange={handleChange}
            placeholder="Enter your description"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 
          disabled:opacity-60 text-white text-[14px] font-semibold py-2.5 rounded-lg transition-all"
        >
          {loading ? "Submitting…" : "Submit Report"}
        </button>
      </div>
    </div>
  );
}
