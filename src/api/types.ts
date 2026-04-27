export interface User {
  name: string;
  birth: string;
  gender: string;
  phone: string;
  email: string;
  isVerified: boolean;
  nationality: "korean" | "foreign";
  penName: string;
}

export type AppStatus = "심사중" | "승인" | "반려";

export interface ApplicationEntry {
  category: string;
  title: string;
  publisher: string;
  date: string;
  genre: string;
}

export interface Application {
  id: string;
  applyNo: string;
  applyDate: string;
  type: string;
  categories: string[];
  status: AppStatus;
  statusDate: string;
  reason?: string;
  entries: ApplicationEntry[];
}

export interface EntryFiles {
  cover?: File;
  inner?: File;
}

export interface CategorySubmission {
  name: string;
  entries: Record<string, string>[];
  files: EntryFiles[];
}

export interface SubmitApplicationRequest {
  type: string;
  categories: CategorySubmission[];
}

export interface SignupRequest {
  name: string;
  birth: string;
  gender: "M" | "F";
  phone: string;
  email: string;
  password: string;
}
