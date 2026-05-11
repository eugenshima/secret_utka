import { useCallback, useEffect, useState } from "react";
import { fetchUserById, type UserResponse } from "../api/users";
import { getStoredUserId } from "../api/auth";
import { ConfirmDialog } from "../components/ConfirmDialog";
import "./users-page.css";

function fmtWhen(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

export function ProfilePage() {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [confirmRefresh, setConfirmRefresh] = useState(false);

  const loadProfile = useCallback(async () => {
    const id = getStoredUserId();
    if (id === null) {
      setErr("Не найден сохранённый идентификатор пользователя — войди снова");
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      setData(await fetchUserById(id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return (
    <div className="app-page">
      <ConfirmDialog
        open={confirmRefresh}
        title="Обновить профиль?"
        message="Повторно запросить данные пользователя с сервера."
        confirmLabel="Обновить"
        cancelLabel="Отмена"
        onCancel={() => setConfirmRefresh(false)}
        onConfirm={() => {
          setConfirmRefresh(false);
          void loadProfile();
        }}
      />
      <header className="app-page__header">
        <h1>Профиль</h1>
        <p>
          Данные твоего аккаунта через <code>/api/users/&lt;id&gt;</code> (идентификатор берётся из ответа логина).
        </p>
      </header>
      <div className="users-toolbar">
        <button type="button" className="users-toolbar__outline" disabled={loading} onClick={() => setConfirmRefresh(true)}>
          Обновить
        </button>
      </div>
      {err !== null ? <div className="err users-banner">{err}</div> : null}
      {loading ? <div className="placeholder-panel">Загрузка…</div> : null}
      {!loading && data !== null ? (
        <dl className="udm-grid" style={{ maxWidth: "36rem", marginTop: "1rem" }}>
          <div>
            <dt>Логин</dt>
            <dd>{data.username}</dd>
          </div>
          <div>
            <dt>Роль</dt>
            <dd>
              <span className="udm-badge">{data.role}</span>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{data.email ?? "—"}</dd>
          </div>
          <div>
            <dt>Создан</dt>
            <dd>{fmtWhen(data.createdAt)}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd>
              <span className="udm-badge">{data.status?.code}</span>
              <span className="udm-status-name"> {data.status?.name}</span>
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
