import { fetchJson } from "./auth";

export type TransactionRow = {
  id: number;
  wallet_id: number;
  sum: number | string;
  current_balance: number | string;
  description: string | null;
  processed_at: string;
  status_code: string;
};

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export async function fetchTransactions(): Promise<SpringPage<TransactionRow>> {
  return fetchJson<SpringPage<TransactionRow>>("/api/transactions");
}
