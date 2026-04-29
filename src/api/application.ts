import { delay } from "./client";
import type { Application, ApplicationEntry, SubmitApplicationRequest, EntryFieldKey } from "./types";
import { INITIAL_APPLICATION_STATUS } from "../constants/rules";

// TODO: 백엔드 연동 시 삭제
let MOCK_APPLICATIONS: Application[] = [
  {
    id: "1",
    applyNo: "2024-ART-003821",
    applyDate: "2025.03.12",
    type: "일반 유형",
    categories: ["문학", "사진"],
    status: "반려",
    statusDate: "2025.04.01",
    applicantName: "김은하",
    reason: "제출 서류 검토 결과 일부 실적의 증빙이 미흡하여 반려 처리되었습니다. 반려된 항목을 확인하고 보완하여 재신청해 주세요.",
    entries: [
      {
        category: "문학", title: "봄의 언저리", publisher: "현대문학", date: "2024.03.15", genre: "시/시조",
        entryStatus: "반려",
        entryReason: "표지 PDF에서 발행일을 확인할 수 없습니다. 발행일이 명시된 판권 페이지가 포함된 표지 파일을 다시 제출해 주세요.",
        files: [
          { label: "표지", filename: "봄의언저리_표지.pdf" },
          { label: "내지", filename: "봄의언저리_내지.pdf" },
        ],
      },
      {
        category: "문학", title: "서울의 밤", publisher: "문학과지성", date: "2024.06.20", genre: "수필",
        entryStatus: "승인",
        files: [
          { label: "표지", filename: "서울의밤_표지.pdf" },
          { label: "내지", filename: "서울의밤_내지.pdf" },
        ],
      },
      {
        category: "사진", title: "도시의 표정", publisher: "사진예술", date: "2024.09.05", genre: "매체발표",
        entryStatus: "승인",
        files: [
          { label: "게재지면", filename: "도시의표정_게재지면.pdf" },
        ],
      },
    ],
  },
  {
    id: "2",
    applyNo: "2024-ART-002150",
    applyDate: "2024.11.08",
    type: "일반 유형",
    categories: ["일반미술"],
    status: "승인",
    statusDate: "2024.11.28",
    applicantName: "이지수",
    entries: [
      {
        category: "일반미술", title: "도시 풍경 시리즈 #1", publisher: "갤러리현대", date: "2024.02.10", genre: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경1_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #2", publisher: "아트스페이스", date: "2024.04.22", genre: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경2_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #3", publisher: "인사갤러리", date: "2024.07.14", genre: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경3_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #4", publisher: "세종문화회관", date: "2024.09.03", genre: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경4_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #5", publisher: "예술의전당", date: "2024.11.20", genre: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경5_도록.pdf" }],
      },
    ],
  },
  {
    id: "3",
    applyNo: "2024-ART-000487",
    applyDate: "2024.06.24",
    type: "일반 유형",
    categories: ["국악", "무용"],
    status: "승인",
    statusDate: "2024.07.18",
    applicantName: "최준혁",
    entries: [
      {
        category: "국악", title: "정간보 해석 공연", publisher: "국립국악원", date: "2024.01.30", genre: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "정간보_프로그램.pdf" }],
      },
      {
        category: "국악", title: "가야금 독주회", publisher: "예술의전당", date: "2024.03.08", genre: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "가야금독주회_프로그램.pdf" }],
      },
      {
        category: "국악", title: "가야금 병창 발표회", publisher: "세종문화회관", date: "2024.05.12", genre: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "가야금병창_프로그램.pdf" }],
      },
      {
        category: "무용", title: "한국 전통무 정기공연", publisher: "국립무용단", date: "2023.11.25", genre: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "전통무_프로그램.pdf" }],
      },
      {
        category: "무용", title: "봄의 향연", publisher: "국립극장", date: "2023.03.15", genre: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "봄의향연_프로그램.pdf" }],
      },
      {
        category: "무용", title: "전통의 숨결", publisher: "예술의전당", date: "2022.09.22", genre: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "전통숨결_프로그램.pdf" }],
      },
    ],
  },
  {
    id: "4",
    applyNo: "2025-ART-005934",
    applyDate: "2025.04.10",
    type: "일반 유형",
    categories: ["영화"],
    status: INITIAL_APPLICATION_STATUS,
    statusDate: "2025.04.10",
    applicantName: "박명수",
    entries: [
      {
        category: "영화", title: "새벽의 소리", publisher: "CJ ENM", date: "2025.01.15", genre: "출연",
        entryStatus: "심사중",
        files: [{ label: "출연 증빙", filename: "새벽의소리_출연증빙.pdf" }],
      },
      {
        category: "영화", title: "마지막 계절", publisher: "롯데엔터테인먼트", date: "2024.08.20", genre: "출연",
        entryStatus: "심사중",
        files: [{ label: "출연 증빙", filename: "마지막계절_출연증빙.pdf" }],
      },
    ],
  },
];

export async function reviewApplication(
  id: string,
  status: "승인" | "반려",
  reason?: string,
): Promise<void> {
  await delay(300);
  const now = new Date();
  const statusDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  MOCK_APPLICATIONS = MOCK_APPLICATIONS.map((a) =>
    a.id === id
      ? { ...a, status, statusDate, reason: status === "반려" ? reason : undefined }
      : a,
  );
}

export async function getApplications(): Promise<Application[]> {
  // TODO: return request<Application[]>("/api/applications");
  await delay(300);
  return MOCK_APPLICATIONS;
}

function toApplicationEntry(
  category: string,
  entry: Partial<Record<EntryFieldKey, string>>,
): ApplicationEntry {
  return {
    category,
    title: entry.title ?? entry.programTitle ?? "",
    publisher: entry.publisher ?? entry.venue ?? entry.broadcaster ?? entry.company ?? "",
    date: entry.date ?? entry.publishDate ?? "",
    genre: entry.genre ?? entry.method ?? entry.role ?? entry.programType ?? "",
  };
}

export async function submitApplication(_data: SubmitApplicationRequest): Promise<{ id: string }> {
  // TODO: const form = new FormData();
  //        const meta = {
  //          type: _data.type,
  //          categories: _data.categories.map(({ name, entries }) => ({ name, entries })),
  //        };
  //        form.append("data", JSON.stringify(meta));
  //        _data.categories.forEach(({ name, files }) =>
  //          files.forEach(({ cover, inner }, idx) => {
  //            if (cover) form.append(`${name}[${idx}].cover`, cover);
  //            if (inner) form.append(`${name}[${idx}].inner`, inner);
  //          })
  //        );
  //        return request<{ id: string }>("/api/applications", { method: "POST", body: form });
  await delay(1000);

  const id = String(Date.now());
  const now = new Date();
  const applyDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  const applyNo = `${now.getFullYear()}-ART-${String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")}`;

  const newApp: Application = {
    id,
    applyNo,
    applyDate,
    type: _data.type,
    categories: _data.categories.map((c) => c.name),
    status: INITIAL_APPLICATION_STATUS,
    statusDate: applyDate,
    entries: _data.categories.flatMap((c) =>
      c.entries.map((e) => toApplicationEntry(c.name, e)),
    ),
  };

  MOCK_APPLICATIONS = [newApp, ...MOCK_APPLICATIONS];
  return { id };
}
