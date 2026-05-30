import { request } from "./client";
import type { User } from "./types";

export type UpdateProfilePayload = Partial<Pick<User, "phone" | "email" | "nationality" | "penName">>;

export async function updateProfile(updates: UpdateProfilePayload): Promise<void> {
  await request("/api/user/profile", { method: "PATCH", body: JSON.stringify(updates) });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request("/api/auth/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function verifyIdentity(): Promise<void> {
  // 본인인증 외부 서비스 연동 시 구현 (PASS, 카카오 인증 등)
}

export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append("photo", file);
  return request<{ url: string }>("/api/user/photo", { method: "POST", body: form }).then((r) => r.url);
}
