import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const STORAGE_KEY = "utka.sidebar.collapsed";

type NavItem = {
  to: string;
  label: string;
  abbrev: string;
};

const NAV: NavItem[] = [
  { to: "/", label: "Главная", abbrev: "⌂" },
  { to: "/profile", label: "Профиль", abbrev: "П" },
  { to: "/users", label: "Пользователи", abbrev: "Ю" },
  { to: "/account", label: "Счёт", abbrev: "С" },
  { to: "/wallet", label: "Кошелёк", abbrev: "К" },
  { to: "/transactions", label: "Транзакции", abbrev: "Т" },
  { to: "/login", label: "Вход", abbrev: "→" },
];

export function Sidebar() {
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

  return (
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
        {NAV.map((item) => (
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
      </nav>

      <button type="button" className="app-sidebar__toggle" onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? "»" : "« Свернуть"}
      </button>
    </aside>
  );
}
