import { fetchJson } from "./auth";

export type UserStatus = {
  id: number;
  code: string;
  name: string;
  description: string | null;
};

export type UserRole = "ADMIN" | "USER";

export type UserResponse = {
  id: number;
  username: string;
  email: string | null;
  displayName: string | null;
  status: UserStatus;
  role: UserRole;
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
  role?: UserRole;
};

export async function fetchUsers(): Promise<SpringPage<UserResponse>> {
  return fetchJson<SpringPage<UserResponse>>("/api/users");
}

export async function fetchUserById(id: number): Promise<UserResponse> {
  return fetchJson<UserResponse>(`/api/users/${id}`);
}

export async function fetchUserStatuses(): Promise<UserStatus[]> {
  return fetchJson<UserStatus[]>("/api/users/statuses");
}

export async function updateUserStatus(userId: number, statusId: number): Promise<void> {
  await fetchJson<undefined>(`/api/users/${userId}/status/${statusId}`, {
    method: "PATCH",
  });
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
