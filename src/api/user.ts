import { delay } from "./client";
import type { User } from "./types";

export type UpdateProfilePayload = Partial<Pick<User, "phone" | "email" | "nationality" | "penName">>;

export async function updateProfile(_updates: UpdateProfilePayload): Promise<void> {
  // TODO: await request("/api/user/profile", { method: "PATCH", body: JSON.stringify(_updates) });
  await delay(500);
}

export async function changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
  // TODO: await request("/api/auth/password", {
  //   method: "PATCH",
  //   body: JSON.stringify({ currentPassword: _currentPassword, newPassword: _newPassword }),
  // });
  await delay(500);
}

export async function verifyIdentity(): Promise<void> {
  // TODO: 본인인증 외부 서비스 연동 (PASS, 카카오 인증 등)
  await delay(1000);
}

export async function uploadPhoto(file: File): Promise<string> {
  // TODO: const form = new FormData();
  //        form.append("photo", file);
  //        return request<{ url: string }>("/api/user/photo", {
  //          method: "POST", body: form, headers: {},
  //        }).then((r) => r.url);
  await delay(300);
  return URL.createObjectURL(file);
}
