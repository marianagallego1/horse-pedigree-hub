const TOKEN_KEY = "hp_access_token";
const BASE_URL_KEY = "hp_api_base_url";

const API_DIRECT_DEFAULT =
  (import.meta.env.VITE_API_PROXY_TARGET as string | undefined) || "https://localhost:7202";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function resolveEnvBaseUrl(): string | undefined {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim()) {
    return normalizeBaseUrl(fromEnv);
  }
  return undefined;
}

/** URL directa al API (SSR y cuando no hay proxy en el navegador) */
function getDirectApiBaseUrl(): string {
  return resolveEnvBaseUrl() ?? normalizeBaseUrl(API_DIRECT_DEFAULT);
}

/**
 * En desarrollo, si no hay VITE_API_BASE_URL, el navegador usa rutas relativas (/api/…)
 * y el proxy de Vite reenvía al backend (sin CORS).
 */
function getBrowserApiBaseUrl(): string {
  const envUrl = resolveEnvBaseUrl();
  if (envUrl) return envUrl;

  const stored =
    typeof window !== "undefined" ? localStorage.getItem(BASE_URL_KEY) : null;
  const direct = normalizeBaseUrl(API_DIRECT_DEFAULT);

  if (import.meta.env.DEV) {
    if (!stored || normalizeBaseUrl(stored) === direct) return "";
    return normalizeBaseUrl(stored);
  }

  if (stored) return normalizeBaseUrl(stored);
  return direct;
}

export function getBaseUrl(): string {
  if (typeof window === "undefined") return getDirectApiBaseUrl();
  return getBrowserApiBaseUrl();
}

export function setBaseUrl(url: string) {
  localStorage.setItem(BASE_URL_KEY, normalizeBaseUrl(url));
}

export function clearBaseUrl() {
  localStorage.removeItem(BASE_URL_KEY);
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

function formatProblemDetails(err: Record<string, unknown>): string {
  if (typeof err.message === "string" && err.message) return err.message;
  if (typeof err.title === "string" && err.title) return err.title;
  const errors = err.errors as Record<string, string[] | undefined> | undefined;
  if (errors && typeof errors === "object") {
    const parts = Object.entries(errors).flatMap(([field, msgs]) =>
      (msgs ?? []).map((m) => `${field}: ${m}`),
    );
    if (parts.length) return parts.join("; ");
  }
  return "Error en la solicitud";
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
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
      const err = (await parseResponseBody(res)) as Record<string, unknown>;
      if (err && typeof err === "object") {
        msg = formatProblemDetails(err);
        detail = typeof err.detail === "string" ? err.detail : undefined;
      }
    } catch { /* noop */ }
    if (res.status === 401) setToken(null);
    throw new ApiError(msg, res.status, detail);
  }
  if (res.status === 204) return undefined as T;

  const body = await parseResponseBody(res);
  if (body === undefined) return undefined as T;
  return body as T;
}

/** Query string con nombres exactos del OpenAPI (p. ej. Nombre, SoloVivos) */
export function apiQs(params: Record<string, string | number | boolean | undefined | null>): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : "";
}

/** @deprecated Usar apiQs con claves del swagger */
export function qs(params: Record<string, unknown>): string {
  return apiQs(params as Record<string, string | number | boolean | undefined | null>);
}

export async function apiBlob(path: string): Promise<Blob> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${getBaseUrl()}${path}`, { headers });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const err = (await parseResponseBody(res)) as Record<string, unknown>;
      if (err && typeof err === "object") msg = formatProblemDetails(err);
    } catch { /* noop */ }
    if (res.status === 401) setToken(null);
    throw new ApiError(msg, res.status);
  }
  return res.blob();
}
