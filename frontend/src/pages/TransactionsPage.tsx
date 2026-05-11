import { useCallback, useEffect, useState } from "react";
import { fetchTransactions, type SpringPage, type TransactionRow } from "../api/transactions";
import { ConfirmDialog } from "../components/ConfirmDialog";

function fmtNum(v: number | string): string {
  return typeof v === "number" ? String(v) : v;
}

export function TransactionsPage() {
  const [page, setPage] = useState<SpringPage<TransactionRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [confirmRefresh, setConfirmRefresh] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setPage(await fetchTransactions());
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
        message="Повторно запросить список транзакций с сервера."
        confirmLabel="Обновить"
        cancelLabel="Отмена"
        onCancel={() => setConfirmRefresh(false)}
        onConfirm={() => {
          setConfirmRefresh(false);
          void load();
        }}
      />
      <header className="app-page__header">
        <h1>Транзакции</h1>
        <p>История операций по кошелькам; администратор видит полный журнал.</p>
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
        <div className="placeholder-panel">Нет транзакций для отображения.</div>
      ) : null}
      {!loading && page !== null && page.content.length > 0 ? (
        <table style={{ marginTop: "1rem", width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "0.45rem 0.2rem" }}>ID</th>
              <th style={{ padding: "0.45rem 0.2rem" }}>Кошелёк</th>
              <th style={{ padding: "0.45rem 0.2rem" }}>Сумма</th>
              <th style={{ padding: "0.45rem 0.2rem" }}>Баланс</th>
              <th style={{ padding: "0.45rem 0.2rem" }}>Учёт</th>
              <th style={{ padding: "0.45rem 0.2rem" }}>Коммент.</th>
            </tr>
          </thead>
          <tbody>
            {page.content.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.5rem 0.2rem", verticalAlign: "top" }}>
                  <code>{row.id}</code>
                </td>
                <td style={{ padding: "0.5rem 0.2rem", verticalAlign: "top" }}>{row.wallet_id}</td>
                <td style={{ padding: "0.5rem 0.2rem", verticalAlign: "top" }}>{fmtNum(row.sum)}</td>
                <td style={{ padding: "0.5rem 0.2rem", verticalAlign: "top" }}>{fmtNum(row.current_balance)}</td>
                <td style={{ padding: "0.5rem 0.2rem", verticalAlign: "top" }}>
                  <small style={{ opacity: 0.85 }}>
                    <code>{row.status_code}</code>
                  </small>
                  <br />
                  {row.processed_at}
                </td>
                <td style={{ padding: "0.5rem 0.2rem", verticalAlign: "top" }}>{row.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
