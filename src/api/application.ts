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
        volume: "원고지 약 150매", character: "단편",
        entryStatus: "반려",
        entryReason: "표지 PDF에서 발행일을 확인할 수 없습니다. 발행일이 명시된 판권 페이지가 포함된 표지 파일을 다시 제출해 주세요.",
        rejectionDetail: {
          fullReason: "제출하신 표지 PDF에서 발행일을 확인할 수 없습니다. 발행일이 명시된 판권 페이지(저작권 페이지)가 포함된 표지 파일을 다시 제출해 주세요. 스캔본의 경우 발행일 부분이 선명하게 보여야 합니다.",
          criteriaTitle: "예술활동증명 세부 기준 (예술인복지법 시행규칙 별표1)",
          criteriaSubtitle: "📖 문학 분야 — 일반기준 (신청일 기준 역산 5년 이내)",
          criteria: [
            { status: "fail", text: "가) 시·시조·수필을 문예지 등에 총 5편 이상 발표한 실적 — 발행일 증빙 서류 필수", badge: "미충족", highlight: true },
            { status: "neutral", text: "나) 소설·평전을 문예지 등에 1편(단편 3편) 이상 발표한 실적", badge: "해당없음" },
            { status: "neutral", text: "마) 문학 작품집을 1권 이상 출간한 실적", badge: "해당없음" },
          ],
          unmetItems: [
            "제출한 표지 PDF에 판권 페이지(발행일 명시 페이지)가 누락되어 발행일 확인 불가",
            "발행일이 실적산정대상기간(2020.01.01 ~ 2025.03.12) 내에 있음을 증빙해야 함",
          ],
          actionSteps: [
            "출판사에서 발행한 도서의 판권 페이지(저작권 표시·발행일·출판사명이 함께 인쇄된 페이지)를 준비합니다.",
            "판권 페이지가 포함된 표지 PDF를 재스캔하거나, 표지 + 판권 페이지를 하나의 PDF로 합쳐 준비합니다. (글자 선명도 300dpi 이상 권장)",
            "아래 재신청하기 버튼을 눌러 해당 작품의 파일을 교체한 뒤 재제출합니다. 이미 승인된 작품은 그대로 유지됩니다.",
          ],
        },
        files: [
          { label: "표지", filename: "봄의언저리_표지.pdf" },
          { label: "내지", filename: "봄의언저리_내지.pdf" },
        ],
      },
      {
        category: "문학", title: "서울의 밤", publisher: "문학과지성", date: "2024.06.20", genre: "수필",
        volume: "원고지 약 200매", character: "단편",
        entryStatus: "승인",
        files: [
          { label: "표지", filename: "서울의밤_표지.pdf" },
          { label: "내지", filename: "서울의밤_내지.pdf" },
        ],
      },
      {
        category: "사진", title: "도시의 표정", publisher: "사진예술", date: "2024.09.05", genre: "매체발표",
        method: "매체발표",
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
        category: "일반미술", title: "도시 풍경 시리즈 #1", publisher: "갤러리현대", date: "2024.02.10", genre: "회화",
        method: "개인전",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경1_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #2", publisher: "아트스페이스", date: "2024.04.22", genre: "회화",
        method: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경2_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #3", publisher: "인사갤러리", date: "2024.07.14", genre: "설치미술",
        method: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경3_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #4", publisher: "세종문화회관", date: "2024.09.03", genre: "조각",
        method: "전시회",
        entryStatus: "승인",
        files: [{ label: "전시 도록", filename: "도시풍경4_도록.pdf" }],
      },
      {
        category: "일반미술", title: "도시 풍경 시리즈 #5", publisher: "예술의전당", date: "2024.11.20", genre: "회화",
        method: "전시회",
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
        role: "연주", method: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "정간보_프로그램.pdf" }],
      },
      {
        category: "국악", title: "가야금 독주회", publisher: "예술의전당", date: "2024.03.08", genre: "공연",
        role: "연주", method: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "가야금독주회_프로그램.pdf" }],
      },
      {
        category: "국악", title: "가야금 병창 발표회", publisher: "세종문화회관", date: "2024.05.12", genre: "공연",
        role: "가창", method: "공연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "가야금병창_프로그램.pdf" }],
      },
      {
        category: "무용", title: "한국 전통무 정기공연", publisher: "국립무용단", date: "2023.11.25", genre: "공연",
        role: "출연",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "전통무_프로그램.pdf" }],
      },
      {
        category: "무용", title: "봄의 향연", publisher: "국립극장", date: "2023.03.15", genre: "공연",
        role: "안무",
        entryStatus: "승인",
        files: [{ label: "공연 프로그램", filename: "봄의향연_프로그램.pdf" }],
      },
      {
        category: "무용", title: "전통의 숨결", publisher: "예술의전당", date: "2022.09.22", genre: "공연",
        role: "출연",
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
        category: "영화", title: "새벽의 소리", publisher: "CJ ENM", date: "2025.01.15", genre: "드라마",
        role: "출연",
        entryStatus: "심사중",
        files: [{ label: "출연 증빙", filename: "새벽의소리_출연증빙.pdf" }],
      },
      {
        category: "영화", title: "마지막 계절", publisher: "롯데엔터테인먼트", date: "2024.08.20", genre: "로맨스",
        role: "연출",
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
    genre: entry.genre ?? entry.programType ?? "",
    volume: entry.volume,
    character: entry.character,
    method: entry.method,
    role: entry.role,
    serialStart: entry.serialStart,
    serialEnd: entry.serialEnd,
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
