import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import "./user-detail-modal.css";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  danger,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="udm-backdrop udm-backdrop--nested"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="udm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="udm-header">
          <h2 id={titleId} className="udm-title">
            {title}
          </h2>
          <button type="button" className="udm-close" onClick={onCancel} aria-label="Закрыть">
            ×
          </button>
        </header>
        <div className="udm-body">
          <p style={{ margin: 0, color: "#334155", fontSize: "0.92rem", lineHeight: 1.45 }}>{message}</p>
        </div>
        <footer className="udm-footer udm-footer--confirm">
          <button type="button" className="udm-btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`udm-btn-primary${danger ? " udm-btn-primary--danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
