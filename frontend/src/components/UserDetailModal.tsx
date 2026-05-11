import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { fetchUserById, fetchUserStatuses, updateUserStatus, type UserResponse, type UserStatus } from "../api/users";
import { ConfirmDialog } from "./ConfirmDialog";
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
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

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

  const dirty = Boolean(data && selectedStatusId !== String(data.status?.id));

  function requestClose() {
    if (dirty) {
      setConfirmCloseOpen(true);
    } else {
      setConfirmCloseOpen(false);
      onClose();
    }
  }

  useEffect(() => {
    if (userId === null || confirmSaveOpen || confirmCloseOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") {
        return;
      }
      const isDirty =
        data !== null && selectedStatusId !== "" && selectedStatusId !== String(data.status?.id);
      if (isDirty) {
        setConfirmCloseOpen(true);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [userId, data, selectedStatusId, onClose, confirmSaveOpen, confirmCloseOpen]);

  const statusOptions = useMemo(() => {
    if (!data || statuses.some((s) => s.id === data.status.id)) {
      return statuses;
    }
    return [data.status, ...statuses];
  }, [statuses, data]);

  async function performSaveStatus() {
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
    <div className="udm-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div className="udm-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(e) => e.stopPropagation()}>
        <header className="udm-header">
          <h2 id={titleId} className="udm-title">
            Пользователь
          </h2>
          <button type="button" className="udm-close" onClick={() => requestClose()} aria-label="Закрыть">
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
                  <dt className="udm-status-dt">
                    <label className="udm-status-field-label" htmlFor={statusSelectId}>
                      Статус
                    </label>
                  </dt>
                  <dd className="udm-status-dd">
                    <select
                      id={statusSelectId}
                      className="udm-select udm-status-select"
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
                    {statusLoading ? <p className="udm-muted udm-status-hint">Загрузка справочника статусов…</p> : null}
                    {!statusLoading && statuses.length === 0 && statusOptions.length === 0 ? (
                      <p className="udm-muted udm-status-hint">Справочник статусов недоступен</p>
                    ) : null}
                    {(() => {
                      const meta = statusOptions.find((s) => String(s.id) === selectedStatusId);
                      if (!meta?.description) {
                        return null;
                      }
                      return (
                        <p className="udm-status-meta-desc" aria-live="polite">
                          {meta.description}
                        </p>
                      );
                    })()}
                  </dd>
                </div>
              </dl>
            </>
          ) : null}
        </div>
        <footer className="udm-footer udm-footer--actions">
          <button type="button" className="udm-btn-exit" onClick={() => requestClose()}>
            Выйти
          </button>
          <button
            type="button"
            className="udm-btn-primary"
            disabled={
              loading ||
              data === null ||
              savingStatus ||
              statusLoading ||
              !statusOptions.length ||
              selectedStatusId === String(data.status?.id)
            }
            onClick={() => setConfirmSaveOpen(true)}
          >
            {savingStatus ? "Сохранение…" : "Сохранить"}
          </button>
        </footer>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(node, document.body)}
      <ConfirmDialog
        open={confirmSaveOpen}
        title="Сохранить статус"
        message="Применить выбранный статус пользователю? Это изменение сразу уходит на сервер."
        confirmLabel="Сохранить"
        cancelLabel="Отмена"
        onCancel={() => setConfirmSaveOpen(false)}
        onConfirm={() => {
          setConfirmSaveOpen(false);
          void performSaveStatus();
        }}
      />
      <ConfirmDialog
        open={confirmCloseOpen}
        title="Закрыть окно?"
        message="Есть несохранённые изменения статуса. Закрыть без сохранения?"
        confirmLabel="Закрыть"
        cancelLabel="Остаться"
        danger
        onCancel={() => setConfirmCloseOpen(false)}
        onConfirm={() => {
          setConfirmCloseOpen(false);
          onClose();
        }}
      />
    </>
  );
}
