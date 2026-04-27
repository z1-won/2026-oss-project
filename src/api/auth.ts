import { delay } from "./client";
import type { User, SignupRequest } from "./types";

// TODO: 백엔드 연동 시 삭제
export const MOCK_CREDENTIALS = { email: "demo@artpass.kr", password: "password1!" };

const MOCK_USER: User = {
  name: "홍길동",
  birth: "1990.05.15",
  gender: "남성",
  phone: "010-1234-5678",
  email: "demo@artpass.kr",
  isVerified: false,
  nationality: "korean",
  penName: "",
};

export async function login(email: string, password: string): Promise<User> {
  // TODO: return request<{ user: User }>("/api/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // }).then((r) => r.user);
  await delay(800);
  if (email !== MOCK_CREDENTIALS.email || password !== MOCK_CREDENTIALS.password) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return { ...MOCK_USER };
}

export async function logout(): Promise<void> {
  // TODO: await request("/api/auth/logout", { method: "POST" });
}

export async function signup(_data: SignupRequest): Promise<User> {
  // TODO: return request<{ user: User }>("/api/auth/signup", {
  //   method: "POST",
  //   body: JSON.stringify(_data),
  // }).then((r) => r.user);
  await delay(1000);
  return {
    name: _data.name,
    birth: _data.birth,
    gender: _data.gender === "M" ? "남성" : "여성",
    phone: _data.phone,
    email: _data.email,
    isVerified: true,
    nationality: "korean",
    penName: "",
  };
}
