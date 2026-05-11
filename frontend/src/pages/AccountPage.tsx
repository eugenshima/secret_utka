import { useCallback, useEffect, useState } from "react";
import { fetchAccounts, type AccountRow, type SpringPage } from "../api/accounts";
import { ConfirmDialog } from "../components/ConfirmDialog";

function fmtAmount(v: AccountRow["amount"]): string {
  if (v === null || v === undefined) {
    return "—";
  }
  return typeof v === "number" ? String(v) : v;
}

export function AccountPage() {
  const [page, setPage] = useState<SpringPage<AccountRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [confirmRefresh, setConfirmRefresh] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setPage(await fetchAccounts());
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="app-page">
      <ConfirmDialog
        open={confirmRefresh}
        title="Обновить данные?"
        message="Повторно запросить счета с сервера."
        confirmLabel="Обновить"
        cancelLabel="Отмена"
        onCancel={() => setConfirmRefresh(false)}
        onConfirm={() => {
          setConfirmRefresh(false);
          void load();
        }}
      />
      <header className="app-page__header">
        <h1>Счёт</h1>
        <p>Список счетов текущего пользователя; администратор видит все.</p>
      </header>
      <div className="users-toolbar">
        <button type="button" className="users-toolbar__outline" disabled={loading} onClick={() => setConfirmRefresh(true)}>
          Обновить
        </button>
        {page !== null ? (
          <span className="users-toolbar__meta">
            Всего: <strong>{page.totalElements}</strong>
          </span>
        ) : null}
      </div>
      {err !== null ? <div className="err users-banner">{err}</div> : null}
      {loading ? <div className="placeholder-panel">Загрузка…</div> : null}
      {!loading && page !== null && page.content.length === 0 ? (
        <div className="placeholder-panel">Нет счетов для отображения.</div>
      ) : null}
      {!loading && page !== null && page.content.length > 0 ? (
        <table style={{ marginTop: "1rem", width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "0.5rem 0.25rem" }}>ID</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Владелец</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Сумма</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Валюта</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {page.content.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.55rem 0.25rem" }}>{row.id}</td>
                <td style={{ padding: "0.55rem 0.25rem" }}>{row.user_id}</td>
                <td style={{ padding: "0.55rem 0.25rem" }}>{fmtAmount(row.amount)}</td>
                <td style={{ padding: "0.55rem 0.25rem" }}>{row.currency_code}</td>
                <td style={{ padding: "0.55rem 0.25rem" }}>
                  <code>{row.status_code}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
