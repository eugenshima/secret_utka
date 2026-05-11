/** Общая обёртка fetch с Bearer и авторизация в localStorage. */

const TOKEN_KEY = "utka.auth.token";
const ROLE_KEY = "utka.auth.role";
const USER_ID_KEY = "utka.auth.userId";
const USERNAME_KEY = "utka.auth.username";

export type StoredRole = "ADMIN" | "USER";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUserId(): number | null {
  try {
    const v = localStorage.getItem(USER_ID_KEY);
    const n = v ? Number.parseInt(v, 10) : NaN;
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function getStoredRole(): StoredRole | null {
  try {
    const r = localStorage.getItem(ROLE_KEY);
    if (r === "ADMIN" || r === "USER") {
      return r;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  return getStoredRole() === "ADMIN";
}

export function clearAuth(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
  } catch {
    /* ignore */
  }
}

export type LoginResponseDto = {
  access_token: string;
  token_type: string;
  role: StoredRole;
  user_id: number;
  username: string;
};

export function saveLoginSession(body: LoginResponseDto): void {
  try {
    localStorage.setItem(TOKEN_KEY, body.access_token);
    localStorage.setItem(ROLE_KEY, body.role);
    localStorage.setItem(USER_ID_KEY, String(body.user_id));
    localStorage.setItem(USERNAME_KEY, body.username);
  } catch {
    /* ignore */
  }
}

export type LoginBody = {
  username: string;
  password: string;
};

async function parseError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  if (text) {
    try {
      const json = JSON.parse(text) as { message?: string };
      if (typeof json.message === "string" && json.message) {
        return json.message;
      }
    } catch {
      /* not JSON */
    }
    return text;
  }
  return res.statusText || `HTTP ${res.status}`;
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const hdr = new Headers(init?.headers ?? undefined);
  if (!hdr.has("Accept")) {
    hdr.set("Accept", "application/json");
  }
  const tok = getAccessToken();
  if (tok && !hdr.has("Authorization")) {
    hdr.set("Authorization", `Bearer ${tok}`);
  }

  const res = await fetch(path, {
    ...init,
    headers: hdr,
    credentials: init?.credentials ?? "omit",
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

export async function loginRequest(body: LoginBody): Promise<LoginResponseDto> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as LoginResponseDto;
}
