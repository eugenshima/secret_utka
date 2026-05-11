import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "../api/auth";
import { Sidebar } from "./Sidebar";
import "./app-layout.css";

export function AppLayout() {
  const loc = useLocation();
  if (!getAccessToken()) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
