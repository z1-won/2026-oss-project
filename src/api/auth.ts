import { request, tokenStore } from "./client";
import type { User, SignupRequest } from "./types";

export async function login(email: string, password: string): Promise<User> {
  const { user, token } = await request<{ user: User; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  tokenStore.set(token);
  return user;
}

export async function logout(): Promise<void> {
  try { await request("/api/auth/logout", { method: "POST" }); }
  finally { tokenStore.clear(); }
}

export async function signup(data: SignupRequest): Promise<User> {
  const { user } = await request<{ user: User }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return user;
}
