import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [form, setForm]       = useState({ UserName: "", Password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setError("");
    if (!form.UserName.trim() || !form.Password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register", form);
        setMode("login");
        setError("");
        alert("Registered! Please log in.");
      } else {
        const res = await api.post("/auth/login", form);
        login(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="min-h-screen bg-bluesky-400 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[18px] font-semibold text-stone-900 mb-1">LOST &amp; FOUND</div>
          <p className="text-[13px] text-stone-400">RUNDA TSS ITEM TRACKING SYSTEM</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
          {/* Tabs */}
          <div className="flex bg-stone-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all
                ${mode === "login" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>Sign in</button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all
                ${mode === "register" ? "bg-white text-stone-9  00 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>Register</button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Username
            </label>
            <input
              name="UserName"
              value={form.UserName}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-[14px] text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5"> Password</label>
            <input
              type="password"
              name="Password"
              value={form.Password}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder="Enter your password"
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-[14px] text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"/>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white font-semibold text-[14px] py-2.5 rounded-lg transition-all">
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>
</div>
    </div>
  );
}
