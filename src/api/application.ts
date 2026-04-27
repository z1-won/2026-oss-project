import { delay } from "./client";
import type { Application, SubmitApplicationRequest } from "./types";

// TODO: 백엔드 연동 시 삭제
const MOCK_APPLICATIONS: Application[] = [
  {
    id: "1",
    applyNo: "2024-ART-003821",
    applyDate: "2025.03.12",
    type: "일반 유형",
    categories: ["문학", "사진"],
    status: "반려",
    statusDate: "2025.04.01",
    reason: "발행일 증빙 서류가 누락되었습니다. 표지 PDF에서 발행일이 확인되지 않으니 재제출 바랍니다.",
    entries: [
      { category: "문학", title: "봄의 언저리", publisher: "현대문학", date: "2024.03.15", genre: "시/시조" },
      { category: "문학", title: "서울의 밤", publisher: "문학과지성", date: "2024.06.20", genre: "수필" },
      { category: "사진", title: "도시의 표정", publisher: "사진예술", date: "2024.09.05", genre: "매체발표" },
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
    entries: [
      { category: "일반미술", title: "도시 풍경 시리즈 #1", publisher: "갤러리현대", date: "2024.02.10", genre: "전시회" },
      { category: "일반미술", title: "도시 풍경 시리즈 #2", publisher: "아트스페이스", date: "2024.04.22", genre: "전시회" },
      { category: "일반미술", title: "도시 풍경 시리즈 #3", publisher: "인사갤러리", date: "2024.07.14", genre: "전시회" },
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
    entries: [
      { category: "국악", title: "정간보 해석 공연", publisher: "국립국악원", date: "2024.01.30", genre: "공연" },
      { category: "국악", title: "가야금 독주회", publisher: "예술의전당", date: "2024.03.08", genre: "공연" },
      { category: "무용", title: "한국 전통무 정기공연", publisher: "국립무용단", date: "2023.11.25", genre: "공연" },
    ],
  },
  {
    id: "4",
    applyNo: "2025-ART-005934",
    applyDate: "2025.04.10",
    type: "일반 유형",
    categories: ["영화"],
    status: "심사중",
    statusDate: "2025.04.10",
    entries: [
      { category: "영화", title: "새벽의 소리", publisher: "CJ ENM", date: "2025.01.15", genre: "출연" },
      { category: "영화", title: "마지막 계절", publisher: "롯데엔터테인먼트", date: "2024.08.20", genre: "출연" },
    ],
  },
];

export async function getApplications(): Promise<Application[]> {
  // TODO: return request<Application[]>("/api/applications");
  await delay(300);
  return MOCK_APPLICATIONS;
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
  return { id: String(Date.now()) };
}
