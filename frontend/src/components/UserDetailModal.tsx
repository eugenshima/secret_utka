import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { fetchUserById, type UserResponse } from "../api/users";
import "./user-detail-modal.css";

type Props = {
  userId: number | null;
  onClose: () => void;
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

export function UserDetailModal({ userId, onClose }: Props) {
  const titleId = useId();
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async (id: number) => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      setData(await fetchUserById(id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId === null) {
      return;
    }
    void load(userId);
  }, [userId, load]);

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
