import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login-page.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: замени на запрос к API (JWT, cookie, Spring Security …)
      await new Promise((r) => setTimeout(r, 400));
      navigate("/", { replace: true });
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

        <form className="login-page__form" onSubmit={onSubmit}>
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
            Вернуться на главную без входа
          </Link>
        </footer>
      </div>
    </div>
  );
}
