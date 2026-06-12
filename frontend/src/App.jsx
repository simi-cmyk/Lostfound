import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar     from "./components/siderbar";
import Topbar      from "./components/Topbar";
import Login       from "./pages/login";
import Dashboard   from "./pages/dashboard";
import AllItems    from "./pages/allItems";
import ReportItem  from "./pages/reportItem";
import MyClaims    from "./pages/myClaims";
import AdminClaims from "./pages/adminClaims";
import AdminItems  from "./pages/adminItems";
import api         from "./api";

function AppShell() {
  const { auth } = useAuth();
  const [page, setPage]     = useState("dashboard");
  const [counts, setCounts] = useState({ total: 0, pending: 0, myClaims: 0 });

  useEffect(() => {
    if (!auth) return;
    Promise.all([api.get("/items"), api.get("/claims")])
      .then(([iRes, cRes]) => {
        const items  = iRes.data;
        const claims = cRes.data;
        setCounts({
          total:    items.length,
          pending:  claims.filter((c) => c.Approved === "Pending").length,
          myClaims: claims.length,
        });
      })
      .catch(() => {});
  }, [auth, page]);

  //  normalize role before comparing so "Admin" doesn't get redirected
  useEffect(() => {
    const role = auth?.role?.toLowerCase();
    if (auth && role !== "admin" && (page === "admin-claims" || page === "admin-items")) {
      setPage("dashboard");
    }
  }, [page, auth]);

  if (!auth) return <Login />;

  const pages = {
    dashboard:      <Dashboard setPage={setPage} />,
    items:          <AllItems />,
    report:         <ReportItem />,
    myclaims:       <MyClaims />,
    "admin-claims": <AdminClaims />,
    "admin-items":  <AdminItems />,
  };

  return (
    <div className="flex min-h-screen bg-[#f7f6f2] font-sans">
      <Sidebar page={page} setPage={setPage} counts={counts} />
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <Topbar page={page} setPage={setPage} />
        <main className="p-6 flex-1 max-w-[900px]">
          {pages[page] || pages["dashboard"]}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}