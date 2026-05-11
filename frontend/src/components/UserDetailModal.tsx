import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { fetchUserById, fetchUserStatuses, updateUserStatus, type UserResponse, type UserStatus } from "../api/users";
import "./user-detail-modal.css";

type Props = {
  userId: number | null;
  onClose: () => void;
  onUserUpdated?: () => void;
};

function formatWhen(iso: string | undefined): string {
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

export function UserDetailModal({ userId, onClose, onUserUpdated }: Props) {
  const titleId = useId();
  const statusSelectId = useId();
  const [data, setData] = useState<UserResponse | null>(null);
  const [statuses, setStatuses] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");

  const loadUser = useCallback(async (id: number) => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const u = await fetchUserById(id);
      setData(u);
      setSelectedStatusId(String(u.status.id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    setStatusLoading(true);
    try {
      setStatuses(await fetchUserStatuses());
    } catch {
      /* справочник необязателен для просмотра */
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId === null) {
      return;
    }
    void loadUser(userId);
    void loadStatuses();
  }, [userId, loadUser, loadStatuses]);

  useEffect(() => {
    if (userId === null) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [userId, onClose]);

  const statusOptions = useMemo(() => {
    if (!data || statuses.some((s) => s.id === data.status.id)) {
      return statuses;
    }
    return [data.status, ...statuses];
  }, [statuses, data]);

  async function onSaveStatus() {
    if (userId === null || data === null) {
      return;
    }
    const sid = Number(selectedStatusId);
    if (!Number.isFinite(sid)) {
      setErr("Выберите статус из списка");
      return;
    }
    setSavingStatus(true);
    setErr(null);
    try {
      await updateUserStatus(userId, sid);
      await loadUser(userId);
      onUserUpdated?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingStatus(false);
    }
  }

  if (userId === null) {
    return null;
  }

  const node = (
    <div className="udm-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="udm-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(e) => e.stopPropagation()}>
        <header className="udm-header">
          <h2 id={titleId} className="udm-title">
            Пользователь
          </h2>
          <button type="button" className="udm-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>
        <div className="udm-body">
          {loading ? <p className="udm-muted">Загрузка…</p> : null}
          {err !== null ? <div className="udm-error">{err}</div> : null}
          {!loading && data !== null ? (
            <>
              <div className="udm-hero">
                <div className="udm-avatar" aria-hidden>
                  {data.username.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="udm-username">{data.username}</p>
                  <p className="udm-sub">{data.displayName || "Без отображаемого имени"}</p>
                </div>
              </div>
              <dl className="udm-grid">
                <div>
                  <dt>ID</dt>
                  <dd>{data.id}</dd>
                </div>
                <div>
                  <dt>Роль</dt>
                  <dd>
                    <span className="udm-badge">{data.role}</span>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{data.email || "—"}</dd>
                </div>
                <div>
                  <dt>Создан</dt>
                  <dd>{formatWhen(data.createdAt)}</dd>
                </div>
                <div className="udm-grid--full">
                  <dt>Статус</dt>
                  <dd>
                    <span className="udm-badge">{data.status?.code ?? "—"}</span>
                    <span className="udm-status-name">{data.status?.name}</span>
                  </dd>
                </div>
                {data.status?.description ? (
                  <div className="udm-grid--full">
                    <dt>Описание статуса</dt>
                    <dd className="udm-desc">{data.status.description}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>status.id</dt>
                  <dd>{data.status?.id ?? "—"}</dd>
                </div>
              </dl>

              <div className="udm-status-edit">
                <label htmlFor={statusSelectId} className="udm-status-edit__label">
                  Сменить статус
                </label>
                <div className="udm-status-edit__row">
                  <select
                    id={statusSelectId}
                    className="udm-select"
                    value={selectedStatusId}
                    disabled={statusLoading || statusOptions.length === 0}
                    onChange={(e) => setSelectedStatusId(e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="udm-btn-primary"
                    disabled={
                      savingStatus ||
                      statusLoading ||
                      !statusOptions.length ||
                      selectedStatusId === String(data.status?.id)
                    }
                    onClick={() => void onSaveStatus()}
                  >
                    {savingStatus ? "…" : "Сохранить"}
                  </button>
                </div>
                {statusLoading ? <p className="udm-muted udm-status-edit__hint">Загрузка справочника…</p> : null}
                {!statusLoading && statuses.length === 0 && statusOptions.length === 0 ? (
                  <p className="udm-muted udm-status-edit__hint">Справочник статусов недоступен</p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <footer className="udm-footer">
          <button type="button" className="udm-btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
