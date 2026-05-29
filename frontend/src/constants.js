

// Item type options (matches DB ENUM)
export const ITEM_TYPES = ["Lost", "Found"];

// Item status options (matches DB ENUM)
export const ITEM_STATUSES = ["Open", "Claimed", "Closed"];

// Claim approval options (matches DB ENUM)
export const CLAIM_STATUSES = ["Pending", "Approved", "Rejected"];

// Emoji map for item types
export const TYPE_EMOJI = {
  Lost:  "🔍",
  Found: "📦",
};

// Tailwind color classes for each status badge
export const STATUS_COLORS = {
  // Item Type
  Lost:     { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    border: "border-red-200" },
  Found:    { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-200" },

  // Item Status
  Open:     { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   border: "border-blue-200" },
  Claimed:  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  border: "border-amber-200" },
  Closed:   { bg: "bg-stone-100", text: "text-stone-600",  dot: "bg-stone-400",  border: "border-stone-200" },

  // Claim Approval
  Pending:  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400",  border: "border-amber-200" },
  Approved: { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-200" },
  Rejected: { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    border: "border-red-200" },
};

// Navigation pages and their display titles
export const PAGE_TITLES = {
  dashboard:      "Dashboard",
  items:          "All Items",
  report:         "Report Item",
  myclaims:       "My Claims",
  "admin-claims": "Approve Claims",
  "admin-items":  "Manage Items",
};

// API base URL (proxied via package.json "proxy" field)
export const API_BASE = "/api";