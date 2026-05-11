import { fetchJson } from "./auth";

export type WalletRow = {
  id: number;
  account_id: number;
  amount: number | string | null;
  status_code: string;
};

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export async function fetchWallets(): Promise<SpringPage<WalletRow>> {
  return fetchJson<SpringPage<WalletRow>>("/api/wallets");
}
