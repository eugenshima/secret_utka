import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, isAdmin } from "../api/auth";
import { ConfirmDialog } from "../components/ConfirmDialog";

const STORAGE_KEY = "utka.sidebar.collapsed";

type NavItem = {
  to: string;
  label: string;
  abbrev: string;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { to: "/", label: "Главная", abbrev: "⌂" },
  { to: "/profile", label: "Профиль", abbrev: "П" },
  { to: "/users", label: "Пользователи", abbrev: "Ю", adminOnly: true },
  { to: "/account", label: "Счёт", abbrev: "С" },
  { to: "/wallet", label: "Кошелёк", abbrev: "К" },
  { to: "/transactions", label: "Транзакции", abbrev: "Т" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const visibleNav = NAV.filter((item) => !item.adminOnly || isAdmin());

  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <>
    <aside className={`app-sidebar${collapsed ? " app-sidebar--narrow" : ""}`}>
      <div className="app-sidebar__brand">
        {!collapsed ? (
          <>
            <span className="app-sidebar__logo">🦆</span>
            <span className="app-sidebar__title">Secret Utka</span>
          </>
        ) : (
          <span className="app-sidebar__logo app-sidebar__logo--solo" title="Secret Utka">
            🦆
          </span>
        )}
      </div>

      <nav className="app-sidebar__nav">
        {visibleNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `app-sidebar__link${isActive ? " app-sidebar__link--active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="app-sidebar__link-abbrev">{collapsed ? item.abbrev : item.label.charAt(0).toUpperCase()}</span>
            {!collapsed ? <span className="app-sidebar__link-text">{item.label}</span> : null}
          </NavLink>
        ))}
        <button type="button" className="app-sidebar__link app-sidebar__link--logout" onClick={() => setConfirmLogout(true)}>
          <span className="app-sidebar__link-abbrev">{collapsed ? "⨯" : "◂"}</span>
          {!collapsed ? <span className="app-sidebar__link-text">Выйти</span> : null}
        </button>
      </nav>

      <button type="button" className="app-sidebar__toggle" onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? "»" : "« Свернуть"}
      </button>
    </aside>
      <ConfirmDialog
        open={confirmLogout}
        title="Выйти из аккаунта?"
        message="Сессия будет завершена, для доступа к приложению потребуется снова войти."
        confirmLabel="Выйти"
        cancelLabel="Отмена"
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
        }}
      />
    </>
  );
}
