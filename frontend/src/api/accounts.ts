import { fetchJson } from "./auth";

export type AccountRow = {
  id: number;
  user_id: number;
  amount: number | string | null;
  currency_code: string;
  status_code: string;
};

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export async function fetchAccounts(): Promise<SpringPage<AccountRow>> {
  return fetchJson<SpringPage<AccountRow>>("/api/accounts");
}
