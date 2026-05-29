import React from 'react';
import { useAuth } from "../context/AuthContext";

function NavLink({ active, onClick, icon, children, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all text-left
        ${active ? "bg-blue-50 text-blue-600 font-semibold" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}
    >
      <span className="text-base">{icon}</span>
      {children}
      {badge !== undefined && (
        <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-px rounded-full border min-w-[20px] text-center
          ${active ? "bg-blue-50 border-blue-400 text-blue-600" : "bg-stone-100 border-stone-200 text-stone-400"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ page, setPage, counts }) {
  const { auth, logout } = useAuth();

  // ✅ FIX: .toLowerCase() handles "Admin", "ADMIN", "admin" all the same
  const isAdmin = auth?.role?.toLowerCase() === "admin";

  return (
    <aside className="w-[220px] bg-white border-r border-stone-200 flex flex-col fixed top-0 left-0 bottom-0 z-10">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-stone-100">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-900">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          Lost &amp; Found
        </div>
        <p className="text-[11px] text-stone-400 mt-0.5 pl-4">School Campus System</p>
      </div>

      {/* User pill */}
      <div className="mx-3 mt-3 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg">
        <p className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">Logged in as</p>
        <p className="text-[13px] font-semibold text-stone-800 truncate">{auth?.userName}</p>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-px rounded-full
          ${isAdmin ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"}`}>
          {auth?.role}
        </span>
      </div>

      {/* Nav */}
      <nav className="p-2 flex-1 mt-1">
        <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase px-2.5 py-2">Main</p>

        <NavLink active={page === "dashboard"} onClick={() => setPage("dashboard")} icon="🏠">
          Dashboard
        </NavLink>
        <NavLink active={page === "items"} onClick={() => setPage("items")} icon="📋" badge={counts.total}>
          All Items
        </NavLink>
        <NavLink active={page === "report"} onClick={() => setPage("report")} icon="➕">
          Report Item
        </NavLink>
        <NavLink active={page === "myclaims"} onClick={() => setPage("myclaims")} icon="📬" badge={counts.myClaims}>
          My Claims
        </NavLink>

        {/*  active page names match setPage values exactly */}
        {isAdmin && (
          <>
            <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase px-2.5 py-2 mt-2">Admin</p>
            <NavLink
              active={page === "admin-claims"}
              onClick={() => setPage("admin-claims")}
              icon="⚙️"
              badge={counts.pending}
            >
              Approve Claims
            </NavLink>
            <NavLink
              active={page === "admin-items"}
              onClick={() => setPage("admin-items")}
              icon="🗂️"
            >
              Manage Items
            </NavLink>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-stone-100">
        <button
          onClick={logout}
          className="w-full text-[13px] text-stone-500 border border-stone-300 bg-stone-50 hover:bg-red-50
           hover:text-red-600 hover:border-red-300 px-3 py-2 rounded-lg transition-all font-medium">
          Sign out
        </button>
      </div>
    </aside>
  );
}