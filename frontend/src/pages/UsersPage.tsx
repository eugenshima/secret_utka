import { useCallback, useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  fetchUserStatuses,
  fetchUsers,
  type SpringPage,
  type UserCreateBody,
  type UserResponse,
  type UserRole,
  type UserStatus,
} from "../api/users";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { UserDetailModal } from "../components/UserDetailModal";
import "./users-page.css";

type FormToggle =
  | null
  | { kind: "show" }
  | { kind: "hide"; dirty: boolean };

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
  const [statusId, setStatusId] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusesCatalog, setStatusesCatalog] = useState<UserStatus[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [newRole, setNewRole] = useState<UserRole>("USER");

  const [confirmRefresh, setConfirmRefresh] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; username: string } | null>(null);
  const [pendingCreate, setPendingCreate] = useState<UserCreateBody | null>(null);
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [formToggle, setFormToggle] = useState<FormToggle>(null);

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

  useEffect(() => {
    void (async () => {
      try {
        setStatusesCatalog(await fetchUserStatuses());
      } catch {
        setStatusesCatalog([]);
      } finally {
        setCatalogLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!statusesCatalog.length) {
      return;
    }
    const n = Number(statusId);
    if (!Number.isFinite(n) || !statusesCatalog.some((s) => s.id === n)) {
      setStatusId(String(statusesCatalog[0].id));
    }
  }, [statusesCatalog, statusId]);

  const formHasInput = Boolean(username.trim() || password || email.trim() || displayName.trim());

  function onFormToolbarClick() {
    if (!showForm) {
      setFormToggle({ kind: "show" });
      return;
    }
    setFormToggle({ kind: "hide", dirty: formHasInput });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!statusesCatalog.length) {
      setError("Сначала должен быть доступен справочник статусов");
      return;
    }
    const sid = Number(statusId);
    if (!Number.isFinite(sid)) {
      setError("status_id должен быть числом");
      return;
    }
    const body: UserCreateBody = {
      username,
      password,
      status_id: sid,
      role: newRole,
    };
    if (email.trim()) {
      body.email = email.trim();
    }
    if (displayName.trim()) {
      body.display_name = displayName.trim();
    }
    setPendingCreate(body);
    setConfirmCreateOpen(true);
  }

  async function executeCreate() {
    if (pendingCreate === null) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createUser(pendingCreate);
      setPassword("");
      setConfirmCreateOpen(false);
      setPendingCreate(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  async function executeDelete() {
    if (deleteTarget === null) {
      return;
    }
    const id = deleteTarget.id;
    setError(null);
    try {
      await deleteUser(id);
      setDeleteTarget(null);
      if (selectedId === id) {
        setSelectedId(null);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function onDeleteCardClick(e: React.MouseEvent, u: UserResponse) {
    e.stopPropagation();
    setDeleteTarget({ id: u.id, username: u.username });
  }

  return (
    <div className="app-page users-page">
      <header className="app-page__header">
        <h1>Пользователи</h1>
        <p>Список учётных записей. Карточка открывает полный профиль в окне поверх страницы.</p>
      </header>

      <UserDetailModal userId={selectedId} onClose={() => setSelectedId(null)} onUserUpdated={() => void load()} />

      <ConfirmDialog
        open={confirmRefresh}
        title="Обновить список?"
        message="Будет повторный запрос к серверу за актуальной страницей пользователей."
        confirmLabel="Обновить"
        cancelLabel="Отмена"
        onCancel={() => setConfirmRefresh(false)}
        onConfirm={() => {
          setConfirmRefresh(false);
          void load();
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Удалить пользователя?"
        message={
          deleteTarget
            ? `Удалить учётную запись «${deleteTarget.username}» (id ${deleteTarget.id})? Действие необратимо.`
            : ""
        }
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          void executeDelete();
        }}
      />

      <ConfirmDialog
        open={confirmCreateOpen}
        title="Создать пользователя?"
        message="На сервер будет отправлен запрос на создание учётной записи с указанными данными."
        confirmLabel="Создать"
        cancelLabel="Отмена"
        onCancel={() => {
          setConfirmCreateOpen(false);
          setPendingCreate(null);
        }}
        onConfirm={() => {
          setConfirmCreateOpen(false);
          void executeCreate();
        }}
      />

      <ConfirmDialog
        open={formToggle?.kind === "show"}
        title="Открыть форму?"
        message="Показать форму создания нового пользователя."
        confirmLabel="Открыть"
        cancelLabel="Отмена"
        onCancel={() => setFormToggle(null)}
        onConfirm={() => {
          setFormToggle(null);
          setShowForm(true);
        }}
      />

      <ConfirmDialog
        open={formToggle?.kind === "hide" && formToggle.dirty}
        title="Скрыть форму?"
        message="В форме уже есть введённые данные. Скрыть форму и сбросить их?"
        confirmLabel="Скрыть"
        cancelLabel="Остаться"
        danger
        onCancel={() => setFormToggle(null)}
        onConfirm={() => {
          setFormToggle(null);
          setShowForm(false);
          setUsername("");
          setPassword("");
          setEmail("");
          setDisplayName("");
        }}
      />

      <ConfirmDialog
        open={formToggle?.kind === "hide" && !formToggle.dirty}
        title="Скрыть форму?"
        message="Скрыть панель создания пользователя?"
        confirmLabel="Скрыть"
        cancelLabel="Отмена"
        onCancel={() => setFormToggle(null)}
        onConfirm={() => {
          setFormToggle(null);
          setShowForm(false);
        }}
      />

      <div className="users-toolbar">
        <div className="users-toolbar__left">
          <button type="button" className="users-toolbar__outline" disabled={loading} onClick={() => setConfirmRefresh(true)}>
            Обновить
          </button>
          <button type="button" className="users-toolbar__outline" onClick={onFormToolbarClick}>
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
              <label htmlFor="status_id">Статус</label>
              <select
                id="status_id"
                className="users-form-select"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                required
                disabled={catalogLoading || statusesCatalog.length === 0}
              >
                {!catalogLoading &&
                  statusesCatalog.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
              </select>
              {catalogLoading ? <span className="muted users-form-catalog-hint">Загрузка справочника…</span> : null}
              {!catalogLoading && statusesCatalog.length === 0 ? (
                <span className="err users-form-catalog-hint" style={{ display: "block", marginTop: "0.35rem" }}>
                  Не удалось загрузить /api/users/statuses
                </span>
              ) : null}
            </div>
            <div>
              <label htmlFor="new-role">Роль</label>
              <select id="new-role" className="users-form-select" value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="users-form-grid__actions">
              <button type="submit" disabled={saving || !statusesCatalog.length}>
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
          {page!.content.map((u) => (
            <li key={u.id}>
              <button type="button" className="users-card" onClick={() => setSelectedId(u.id)}>
                <div className="users-card__top">
                  <div className="users-card__avatar" aria-hidden>
                    {u.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="users-card__head">
                    <span className="users-card__name">{u.username}</span>
                    <span className="users-card__badge">{u.status?.code ?? "—"}</span>
                    <span className="users-card__badge users-card__badge--muted">{u.role}</span>
                  </div>
                  <button
                    type="button"
                    className="users-card__delete"
                    title="Удалить"
                    aria-label={`Удалить ${u.username}`}
                    onClick={(e) => onDeleteCardClick(e, u)}
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
