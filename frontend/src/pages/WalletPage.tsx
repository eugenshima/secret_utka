import { useCallback, useEffect, useState } from "react";
import { fetchWallets, type SpringPage, type WalletRow } from "../api/wallets";

function fmtAmount(v: WalletRow["amount"]): string {
  if (v === null || v === undefined) {
    return "—";
  }
  return typeof v === "number" ? String(v) : v;
}

export function WalletPage() {
  const [page, setPage] = useState<SpringPage<WalletRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setPage(await fetchWallets());
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
      <header className="app-page__header">
        <h1>Кошельки</h1>
        <p>Твои кошельки; администратор видит записи всех пользователей.</p>
      </header>
      <div className="users-toolbar">
        <button type="button" className="users-toolbar__outline" disabled={loading} onClick={() => void load()}>
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
        <div className="placeholder-panel">Нет кошельков для отображения.</div>
      ) : null}
      {!loading && page !== null && page.content.length > 0 ? (
        <table style={{ marginTop: "1rem", width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "0.5rem 0.25rem" }}>ID</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Счёт</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Сумма</th>
              <th style={{ padding: "0.5rem 0.25rem" }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {page.content.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.55rem 0.25rem" }}>{row.id}</td>
                <td style={{ padding: "0.55rem 0.25rem" }}>{row.account_id}</td>
                <td style={{ padding: "0.55rem 0.25rem" }}>{fmtAmount(row.amount)}</td>
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
