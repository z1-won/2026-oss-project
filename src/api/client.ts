export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: isFormData
      ? { ...init?.headers }
      : { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  const data: unknown = await res.json();
  return data as T;
}

export const delay = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
