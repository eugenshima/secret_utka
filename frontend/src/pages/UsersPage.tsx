import { useCallback, useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  fetchUsers,
  type SpringPage,
  type UserCreateBody,
  type UserResponse,
} from "../api/users";
import { UserDetailModal } from "../components/UserDetailModal";
import "./users-page.css";

export function UsersPage() {
  const [page, setPage] = useState<SpringPage<UserResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [statusId, setStatusId] = useState("1");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPage(await fetchUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sid = Number(statusId);
    if (!Number.isFinite(sid)) {
      setError("status_id должен быть числом");
      return;
    }
    const body: UserCreateBody = {
      username,
      password,
      status_id: sid,
    };
    if (email.trim()) {
      body.email = email.trim();
    }
    if (displayName.trim()) {
      body.display_name = displayName.trim();
    }
    setSaving(true);
    setError(null);
    try {
      await createUser(body);
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteCard(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!window.confirm(`Удалить пользователя #${id}?`)) {
      return;
    }
    setError(null);
    try {
      await deleteUser(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="app-page users-page">
      <header className="app-page__header">
        <h1>Пользователи</h1>
        <p>Список учётных записей. Карточка открывает полный профиль в окне поверх страницы.</p>
      </header>

      <UserDetailModal userId={selectedId} onClose={() => setSelectedId(null)} />

      <div className="users-toolbar">
        <div className="users-toolbar__left">
          <button type="button" className="users-toolbar__outline" disabled={loading} onClick={() => void load()}>
            Обновить
          </button>
          <button type="button" className="users-toolbar__outline" onClick={() => setShowForm((x) => !x)}>
            {showForm ? "Скрыть форму" : "Новый пользователь"}
          </button>
        </div>
        {page !== null ? (
          <span className="users-toolbar__meta">
            Всего: <strong>{page.totalElements}</strong>
          </span>
        ) : null}
      </div>

      {error !== null ? <div className="err users-banner">{error}</div> : null}

      {showForm ? (
        <section className="users-form-panel">
          <h2 className="users-form-panel__title">Создание</h2>
          <form className="users-form-grid" onSubmit={onSubmit}>
            <div>
              <label htmlFor="username">Логин</label>
              <input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password">Пароль</label>
              <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="display_name">Отображаемое имя</label>
              <input id="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="status_id">status_id</label>
              <input id="status_id" value={statusId} onChange={(e) => setStatusId(e.target.value)} required />
            </div>
            <div className="users-form-grid__actions">
              <button type="submit" disabled={saving}>
                {saving ? "Сохранение…" : "Создать"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {loading ? (
        <div className="users-skeleton" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="users-skeleton__card" />
          ))}
        </div>
      ) : page === null || page.content.length === 0 ? (
        <div className="users-empty">Пока нет пользователей — создай первого через кнопку выше.</div>
      ) : (
        <ul className="users-grid">
          {page.content.map((u) => (
            <li key={u.id}>
              <button type="button" className="users-card" onClick={() => setSelectedId(u.id)}>
                <div className="users-card__top">
                  <div className="users-card__avatar" aria-hidden>
                    {u.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="users-card__head">
                    <span className="users-card__name">{u.username}</span>
                    <span className="users-card__badge">{u.status?.code ?? "—"}</span>
                  </div>
                  <button
                    type="button"
                    className="users-card__delete"
                    title="Удалить"
                    aria-label={`Удалить ${u.username}`}
                    onClick={(e) => void onDeleteCard(e, u.id)}
                  >
                    ×
                  </button>
                </div>
                <p className="users-card__email">{u.email || "email не указан"}</p>
                <p className="users-card__hint">Нажми, чтобы открыть детали</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
