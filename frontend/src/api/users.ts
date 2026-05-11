export type UserStatus = {
  id: number;
  code: string;
  name: string;
  description: string | null;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string | null;
  displayName: string | null;
  status: UserStatus;
  createdAt: string;
};

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type UserCreateBody = {
  username: string;
  password: string;
  email?: string | null;
  display_name?: string | null;
  status_id: number;
};

async function parseError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  return text || res.statusText || `HTTP ${res.status}`;
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }
  const text = await res.text();
  if (!text.trim()) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export async function fetchUsers(): Promise<SpringPage<UserResponse>> {
  return fetchJson<SpringPage<UserResponse>>("/api/users");
}

export async function fetchUserById(id: number): Promise<UserResponse> {
  return fetchJson<UserResponse>(`/api/users/${id}`);
}

export async function createUser(body: UserCreateBody): Promise<void> {
  await fetchJson<undefined>("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id: number): Promise<void> {
  await fetchJson<undefined>(`/api/users/${id}`, {
    method: "DELETE",
  });
}
