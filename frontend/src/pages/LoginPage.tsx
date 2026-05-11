import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { loginRequest, saveLoginSession } from "../api/auth";
import "./login-page.css";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromPath =
    typeof (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname === "string"
      ? (location.state as { from: { pathname: string } }).from.pathname
      : "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const dto = await loginRequest({ username, password });
      saveLoginSession(dto);
      navigate(fromPath.startsWith("/login") ? "/" : fromPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--1" aria-hidden />
      <div className="login-page__glow login-page__glow--2" aria-hidden />
      <div className="login-page__card">
        <div className="login-page__brand">
          <span className="login-page__logo" aria-hidden>
            🦆
          </span>
          <div>
            <h1 className="login-page__title">Secret Utka</h1>
            <p className="login-page__subtitle">Вход в аккаунт</p>
          </div>
        </div>

        {error !== null ? <div className="login-page__err">{error}</div> : null}

        <form className="login-page__form" onSubmit={(e) => void onSubmit(e)}>
          <div className="login-page__field">
            <label htmlFor="login-username">Логин</label>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Введи логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-page__field">
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-page__submit" disabled={submitting}>
            {submitting ? "Входим…" : "Войти"}
          </button>
        </form>

        <footer className="login-page__footer">
          <Link to="/" className="login-page__link">
            Вернуться на главную
          </Link>
        </footer>
      </div>
    </div>
  );
}
