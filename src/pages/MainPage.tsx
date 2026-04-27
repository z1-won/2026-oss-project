import styles from "./MainPage.module.css";

interface MainPageProps {
  onApply: () => void;
  onStatus: () => void;
}

const NOTICES = [
  { id: 1, category: "공지", title: "2025년 예술활동증명 심사 일정 안내", date: "2025.04.15", isNew: true },
  { id: 2, category: "공지", title: "예술활동증명 세부 기준 개정 안내 (2023.9.12. 시행)", date: "2025.03.28", isNew: false },
  { id: 3, category: "안내", title: "서류 제출 형식 변경 안내 (PDF 전환)", date: "2025.03.10", isNew: false },
  { id: 4, category: "안내", title: "개인정보처리방침 개정 안내", date: "2025.02.20", isNew: false },
];

const STEPS = [
  { num: "01", title: "분야 선택", desc: "최대 3개 분야 선택" },
  { num: "02", title: "실적 입력", desc: "분야별 세부 실적 및 파일 제출" },
  { num: "03", title: "신청 제출", desc: "내용 확인 후 최종 제출" },
  { num: "04", title: "심사 및 결과", desc: "담당자 심사 후 결과 통보" },
];

const QUICK_LINKS = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
        <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" />
        <path d="M4 10l12 6 12-6" />
        <line x1="16" y1="16" x2="16" y2="28" />
      </svg>
    ),
    label: "예술활동증명 신청",
    desc: "일반·특례 유형 신청",
    action: "apply" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
        <rect x="4" y="4" width="24" height="24" rx="3" />
        <line x1="10" y1="12" x2="22" y2="12" />
        <line x1="10" y1="17" x2="22" y2="17" />
        <line x1="10" y1="22" x2="16" y2="22" />
      </svg>
    ),
    label: "신청 현황 조회",
    desc: "진행 상태 및 결과 확인",
    action: "status" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
        <circle cx="16" cy="16" r="12" />
        <line x1="16" y1="10" x2="16" y2="17" />
        <circle cx="16" cy="21" r="0.5" fill="currentColor" strokeWidth={2} />
      </svg>
    ),
    label: "공지사항",
    desc: "주요 공지 및 안내사항",
    action: null,
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
        <circle cx="16" cy="12" r="5" />
        <path d="M6 26c0-5.5 4.5-9 10-9s10 3.5 10 9" />
      </svg>
    ),
    label: "이용안내",
    desc: "신청 자격 및 절차 안내",
    action: null,
  },
];

export default function MainPage({ onApply, onStatus }: MainPageProps) {
  const handleQuickLink = (action: "apply" | "status" | null) => {
    if (action === "apply") onApply();
    else if (action === "status") onStatus();
  };

  return (
    <div className={styles.page}>
      {/* 히어로 */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>한국예술인복지재단 도우미 서비스</p>
          <h1 className={styles.heroTitle}>
            예술인의 활동을<br />증명합니다
          </h1>
          <p className={styles.heroDesc}>
            예술활동증명은 예술인의 창작 실적을 공식적으로 인정받는 제도입니다.<br />
            5년간의 활동 실적을 바탕으로 예술인 지원 혜택을 받으세요.
          </p>
          <div className={styles.heroCta}>
            <button type="button" className={styles.ctaPrimary} onClick={onApply}>
              지금 신청하기
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={16} height={16}>
                <line x1="4" y1="10" x2="16" y2="10" />
                <polyline points="11 5 16 10 11 15" />
              </svg>
            </button>
            <button type="button" className={styles.ctaSecondary} onClick={onStatus}>
              신청 현황 조회
            </button>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
        </div>
      </section>

      {/* 빠른 메뉴 */}
      <section className={styles.quick}>
        <div className={styles.sectionInner}>
          <ul className={styles.quickGrid} role="list">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  className={styles.quickCard}
                  onClick={() => handleQuickLink(link.action)}
                  disabled={link.action === null}
                >
                  <span className={styles.quickIcon}>{link.icon}</span>
                  <span className={styles.quickLabel}>
                    {link.label}
                    {link.action === null && <span className={styles.comingSoon}>준비 중</span>}
                  </span>
                  <span className={styles.quickDesc}>{link.desc}</span>
                  <svg className={styles.quickArrow} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={14} height={14}>
                    <line x1="3" y1="8" x2="13" y2="8" />
                    <polyline points="9 4 13 8 9 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 신청 절차 */}
      <section className={styles.process}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>신청 절차</h2>
          <p className={styles.sectionDesc}>예술활동증명 신청은 4단계로 진행됩니다.</p>
          <ol className={styles.stepList} role="list">
            {STEPS.map((step, i) => (
              <li key={step.num} className={styles.stepItem}>
                <div className={styles.stepNum}>{step.num}</div>
                {i < STEPS.length - 1 && <div className={styles.stepArrow} aria-hidden="true" />}
                <div className={styles.stepBody}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepDesc}>{step.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 공지사항 + 신청 자격 */}
      <section className={styles.bottom}>
        <div className={styles.sectionInner}>
          <div className={styles.bottomGrid}>
            {/* 공지사항 */}
            <div className={styles.noticeBox}>
              <div className={styles.boxHeader}>
                <h2 className={styles.boxTitle}>공지사항</h2>
                <button type="button" className={styles.moreBtn}>더보기</button>
              </div>
              <ul className={styles.noticeList} role="list">
                {NOTICES.map((notice) => (
                  <li key={notice.id} className={styles.noticeItem}>
                    <button type="button" className={styles.noticeBtn}>
                      <span className={`${styles.noticeCat} ${notice.category === "공지" ? styles.noticeCatPrimary : ""}`}>
                        {notice.category}
                      </span>
                      <span className={styles.noticeTitle}>
                        {notice.title}
                        {notice.isNew && <span className={styles.newBadge}>N</span>}
                      </span>
                      <span className={styles.noticeDate}>{notice.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 신청 자격 */}
            <div className={styles.eligibilityBox}>
              <div className={styles.boxHeader}>
                <h2 className={styles.boxTitle}>신청 자격</h2>
              </div>
              <ul className={styles.eligibilityList}>
                <li>
                  <span className={styles.eligibilityNum}>1</span>
                  <div>
                    <strong>문화예술 활동 실적 기준</strong>
                    <p>최근 5년간 해당 분야 실적이 기준 이상인 예술인</p>
                  </div>
                </li>
                <li>
                  <span className={styles.eligibilityNum}>2</span>
                  <div>
                    <strong>예술 활동 소득 기준</strong>
                    <p>5년간 600만원 이상 또는 전년도 120만원 이상 예술 소득</p>
                  </div>
                </li>
                <li>
                  <span className={styles.eligibilityNum}>3</span>
                  <div>
                    <strong>기술지원·기획 인력 기준</strong>
                    <p>공연·전시 등 문화예술 행사의 기술지원 또는 기획 참여 실적</p>
                  </div>
                </li>
              </ul>
              <button type="button" className={styles.eligibilityDetailBtn} onClick={onApply}>
                신청하러 가기
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={13} height={13}>
                  <line x1="3" y1="8" x2="13" y2="8" />
                  <polyline points="9 4 13 8 9 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
