
 
import { useState, useEffect, useCallback } from "react";
import api from "../api";
 
export function useItems(filters = {}) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
 
  // Build query string from filters: { type, status }
  const buildQuery = (f) => {
    const params = new URLSearchParams();
    if (f.type)   params.append("type",   f.type);
    if (f.status) params.append("status", f.status);
    return params.toString() ? `?${params.toString()}` : "";
  };
 
  const fetchItems = useCallback(() => {
    setLoading(true);
    setError("");
    api.get(`/items${buildQuery(filters)}`)
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load items"))
      .finally(() => setLoading(false));
  }, [filters.type, filters.status]);
 
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
 
  // ── Actions ──────────────────────────────
 
  async function reportItem({ ItemName, Description, Type }) {
    const res = await api.post("/items", { ItemName, Description, Type });
    fetchItems();
    return res.data;
  }
 
  async function updateItem(ItemID, data) {
    await api.put(`/items/${ItemID}`, data);
    fetchItems();
  }
 
  async function deleteItem(ItemID) {
    await api.delete(`/items/${ItemID}`);
    setItems((prev) => prev.filter((i) => i.ItemID !== ItemID));
  }
 
  // ── Derived stats ─────────────────────────
 
  const stats = {
    total:   items.length,
    lost:    items.filter((i) => i.Type   === "Lost").length,
    found:   items.filter((i) => i.Type   === "Found").length,
    open:    items.filter((i) => i.Status === "Open").length,
    claimed: items.filter((i) => i.Status === "Claimed").length,
    closed:  items.filter((i) => i.Status === "Closed").length,
  };
 
  return {
    items,
    loading,
    error,
    stats,
    refetch:    fetchItems,
    reportItem,
    updateItem,
    deleteItem,
  };
}
 
 

 
export function useClaims() {
  const [claims, setClaims]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
 
  const fetchClaims = useCallback(() => {
    setLoading(true);
    setError("");
    api.get("/claims")
      .then((res) => setClaims(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load claims"))
      .finally(() => setLoading(false));
  }, []);
 
  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);
 
  async function submitClaim(ItemID) {
    const res = await api.post("/claims", { ItemID });
    fetchClaims();
    return res.data;
  }
 
  async function approveClaim(ClaimID, decision) {
    await api.put(`/claims/${ClaimID}/approve`, { decision });
    fetchClaims();
  }
 
  async function deleteClaim(ClaimID) {
    await api.delete(`/claims/${ClaimID}`);
    setClaims((prev) => prev.filter((c) => c.ClaimID !== ClaimID));
  }
 
  const stats = {
    total:    claims.length,
    pending:  claims.filter((c) => c.Approved === "Pending").length,
    approved: claims.filter((c) => c.Approved === "Approved").length,
    rejected: claims.filter((c) => c.Approved === "Rejected").length,
  };
 
  return {
    claims,
    loading,
    error,
    stats,
    refetch:      fetchClaims,
    submitClaim,
    approveClaim,
    deleteClaim,
  };
}