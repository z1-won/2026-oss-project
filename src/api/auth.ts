import { delay, tokenStore } from "./client";
import type { User, SignupRequest } from "./types";

// TODO: 백엔드 연동 시 삭제
export const MOCK_CREDENTIALS = {
  user:  { email: "demo@artpass.kr",  password: "password1!" },
  admin: { email: "admin@artpass.kr", password: "admin1!" },
};

const MOCK_ACCOUNTS: User[] = [
  {
    name: "홍길동",
    birth: "1990.05.15",
    gender: "남성",
    phone: "010-1234-5678",
    email: "demo@artpass.kr",
    isVerified: false,
    nationality: "korean",
    penName: "",
    role: "user",
  },
  {
    name: "관리자",
    birth: "1985.01.01",
    gender: "남성",
    phone: "010-0000-0000",
    email: "admin@artpass.kr",
    isVerified: true,
    nationality: "korean",
    penName: "",
    role: "admin",
  },
];

const MOCK_PASSWORDS: Record<string, string> = {
  "demo@artpass.kr":  "password1!",
  "admin@artpass.kr": "admin1!",
};

export async function login(email: string, password: string): Promise<User> {
  // TODO: const { user, token } = await request<{ user: User; token: string }>("/api/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // });
  // tokenStore.set(token);
  // return user;
  await delay(800);
  const account = MOCK_ACCOUNTS.find((u) => u.email === email);
  if (!account || MOCK_PASSWORDS[email] !== password) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  tokenStore.set("mock-token");
  return { ...account };
}

export async function logout(): Promise<void> {
  // TODO: await request("/api/auth/logout", { method: "POST" });
  tokenStore.clear();
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
    role: "user",
  };
}
