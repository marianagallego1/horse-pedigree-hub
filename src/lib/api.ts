const TOKEN_KEY = "hp_access_token";
const BASE_URL_KEY = "hp_api_base_url";
const DEFAULT_BASE_URL = "http://localhost:5203";

export function getBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  return localStorage.getItem(BASE_URL_KEY) || DEFAULT_BASE_URL;
}
export function setBaseUrl(url: string) {
  localStorage.setItem(BASE_URL_KEY, url.replace(/\/$/, ""));
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  detail?: string;
  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { raw?: boolean } = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getBaseUrl()}${path}`, { ...options, headers });

  if (options.raw) return res as unknown as T;

  if (!res.ok) {
    let msg = res.statusText;
    let detail: string | undefined;
    try {
      const err = await res.json();
      msg = err.message || err.title || msg;
      detail = err.detail;
    } catch { /* noop */ }
    if (res.status === 401) setToken(null);
    throw new ApiError(msg, res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return undefined as T;
}

export function qs(params: Record<string, unknown>): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : "";
}
