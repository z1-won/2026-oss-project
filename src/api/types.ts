export interface User {
  name: string;
  birth: string;
  gender: "M" | "F";
  phone: string;
  email: string;
  // Jackson이 isVerified → verified 로 직렬화하는 경우를 대비해 양쪽 허용
  isVerified?: boolean;
  verified?: boolean;
  nationality: "korean" | "foreign";
  penName: string;
  role: "user" | "admin";
}

export type AppStatus = "심사중" | "승인" | "반려";

export interface EntryFile {
  label: string;
  filename: string;
}

export type EntryStatus = "승인" | "반려" | "심사중";

export interface ApplicationEntry {
  category: string;
  title: string;
  publisher: string;
  date: string;
  genre: string;
  entryStatus?: EntryStatus;
  entryReason?: string;
  files?: EntryFile[];
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
  applicantName?: string;
}

export type EvidenceSlot = "workImage" | "detailPage1" | "detailPage2" | "income" | "other";

export interface EntryFiles {
  workImage?: File;
  detailPage1?: File;
  detailPage2?: File;
  income?: File;
  other?: File;
}

export type EntryFieldKey =
  | "title" | "publisher" | "genre" | "publishDate" | "volume" | "character"
  | "venue" | "date" | "method" | "serialStart" | "serialEnd"
  | "programTitle" | "broadcaster" | "programType" | "role" | "company";

export interface CategorySubmission {
  name: string;
  entries: Partial<Record<EntryFieldKey, string>>[];
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
