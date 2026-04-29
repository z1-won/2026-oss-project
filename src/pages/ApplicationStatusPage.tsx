import { useState, useEffect } from "react";
import styles from "./ApplicationStatusPage.module.css";
import type { Application, AppStatus, EntryStatus, ApplicationEntry } from "../api/types";
import { getApplications } from "../api/application";
import CategoryIcon from "../components/common/CategoryIcon";

// ── 헬퍼 ──────────────────────────────────────────────────────
function getFieldType(app: Application) {
  return app.categories.length === 1 ? "단일 분야" : `복합 분야 ${app.categories.length}개`;
}

function getRejectedCount(entries: ApplicationEntry[]) {
  return entries.filter((e) => e.entryStatus === "반려").length;
}

// ── 상태 배지 ─────────────────────────────────────────────────
const STATUS_CFG: Record<AppStatus, { label: string; cls: string }> = {
  심사중: { label: "심사중", cls: "badgePending"  },
  승인:   { label: "승인",   cls: "badgeApproved" },
  반려:   { label: "반려",   cls: "badgeRejected" },
};

const ENTRY_STATUS_CFG: Record<EntryStatus, { label: string; cls: string }> = {
  심사중: { label: "심사중", cls: "entryTagPending"  },
  승인:   { label: "승인",   cls: "entryTagApproved" },
  반려:   { label: "반려",   cls: "entryTagRejected" },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const { label, cls } = STATUS_CFG[status];
  return <span className={`${styles.badge} ${styles[cls]}`}>{label}</span>;
}

// ── 타임라인 ──────────────────────────────────────────────────
const STEPS = ["접수 완료", "서류 심사", "심사 완료"];

function StatusTimeline({ status }: { status: AppStatus }) {
  const active = status === "심사중" ? 1 : 2;
  const isRejected = status === "반려";

  return (
    <div className={styles.timeline}>
      {STEPS.map((label, i) => {
        const done = i < active;
        const current = i === active;
        const nodeCls = done
          ? styles.timelineNodeDone
          : current
            ? (isRejected ? styles.timelineNodeRejected : styles.timelineNodeActive)
            : styles.timelineNodeFuture;

        return (
          <div key={label} className={styles.timelineStep}>
            <div className={`${styles.timelineNode} ${nodeCls}`}>
              {done ? (
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={9} height={9}>
                  <polyline points="2 7.5 5.5 11 12 3.5" />
                </svg>
              ) : current && isRejected ? (
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={9} height={9}>
                  <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
                </svg>
              ) : (
                <span className={current ? styles.timelinePulse : styles.timelineDot} />
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`${styles.timelineConnector} ${done ? styles.timelineConnectorDone : ""}`} />
            )}
            <span className={`${styles.timelineLabel} ${i <= active ? styles.timelineLabelActive : ""}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── 상태 배너 ─────────────────────────────────────────────────
function StatusBanner({ app }: { app: Application }) {
  const rejectedCount = getRejectedCount(app.entries);

  if (app.status === "승인") return (
    <div className={`${styles.statusBanner} ${styles.bannerApproved}`}>
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" width={28} height={28} aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#16a34a" />
        <polyline points="6 12.5 10 16 18 8" stroke="#fff" strokeWidth={2.5} />
      </svg>
      <div>
        <p className={styles.bannerTitle}>예술활동증명이 승인되었습니다</p>
        <p className={styles.bannerDesc}>제출하신 {app.entries.length}건의 실적이 모두 심사를 통과했습니다. 마이페이지에서 증명서를 발급받으세요.</p>
      </div>
    </div>
  );

  if (app.status === "반려") return (
    <div className={`${styles.statusBanner} ${styles.bannerRejected}`}>
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" width={28} height={28} aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#dc2626" />
        <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" stroke="#fff" strokeWidth={2.5} />
        <line x1="16.5" y1="7.5" x2="7.5" y2="16.5" stroke="#fff" strokeWidth={2.5} />
      </svg>
      <div>
        <p className={styles.bannerTitle}>심사 결과 반려 처리되었습니다</p>
        <p className={styles.bannerDesc}>
          총 {app.entries.length}건 중 <strong>{rejectedCount}건이 반려</strong>되었습니다.
          아래 항목별 반려 사유를 확인하고 재신청해 주세요.
        </p>
      </div>
    </div>
  );

  return (
    <div className={`${styles.statusBanner} ${styles.bannerPending}`}>
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" width={28} height={28} aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#d97706" />
        <line x1="12" y1="7" x2="12" y2="13" stroke="#fff" strokeWidth={2.5} />
        <circle cx="12" cy="16.5" r="1.3" fill="#fff" />
      </svg>
      <div>
        <p className={styles.bannerTitle}>서류 심사가 진행 중입니다</p>
        <p className={styles.bannerDesc}>총 {app.entries.length}건의 실적을 검토 중입니다. 신청일로부터 평균 14일 내 완료되며 결과를 안내드립니다.</p>
      </div>
    </div>
  );
}

// ── PDF 다운로드 버튼 ─────────────────────────────────────────
function FileBtn({ label, filename }: { label: string; filename: string }) {
  function handleDownload() {
    // TODO: 실제 연동 시 → fetch(`/api/files/${filename}`)
    const blob = new Blob([`[데모] ${filename}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button type="button" className={styles.fileBtn} onClick={handleDownload} title={filename}>
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={11} height={11} aria-hidden="true">
        <path d="M7 2v7M4.5 6.5 7 9l2.5-2.5" /><line x1="2" y1="12" x2="12" y2="12" />
      </svg>
      {label}
    </button>
  );
}

// ── 작품 카드 ─────────────────────────────────────────────────
function EntryCard({ entry, index }: { entry: ApplicationEntry; index: number }) {
  const status = entry.entryStatus ?? "심사중";
  const isRejected = status === "반려";
  const isApproved = status === "승인";
  const { label, cls } = ENTRY_STATUS_CFG[status];

  return (
    <div className={`${styles.entryCard} ${isRejected ? styles.entryCardRejected : ""}`}>
      <div className={styles.entryCardTop}>
        {/* 상태 인디케이터 */}
        <div className={`${styles.entryDot} ${isRejected ? styles.entryDotRejected : isApproved ? styles.entryDotApproved : styles.entryDotPending}`}>
          {isApproved ? (
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={7} height={7}>
              <polyline points="1.5 5.5 4 8 8.5 2.5" />
            </svg>
          ) : isRejected ? (
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={7} height={7}>
              <line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" />
            </svg>
          ) : (
            <span className={styles.entryDotInner} />
          )}
        </div>

        {/* 작품 정보 */}
        <div className={styles.entryInfo}>
          <div className={styles.entryTitleRow}>
            <span className={styles.entrySeq}>{index + 1}</span>
            <span className={styles.entryTitle}>{entry.title}</span>
            <span className={`${styles.entryTag} ${styles[cls]}`}>{label}</span>
          </div>
          <div className={styles.entryMeta}>
            {[entry.genre, entry.publisher, entry.date].filter(Boolean).join("  ·  ")}
          </div>
        </div>

        {/* PDF 다운로드 */}
        {entry.files && entry.files.length > 0 && (
          <div className={styles.entryFiles}>
            {entry.files.map((f) => (
              <FileBtn key={f.label} label={f.label} filename={f.filename} />
            ))}
          </div>
        )}
      </div>

      {/* 반려 사유 — 이 페이지의 핵심 정보 */}
      {isRejected && entry.entryReason && (
        <div className={styles.rejectionBox}>
          <p className={styles.rejectionBoxLabel}>반려 사유</p>
          <p className={styles.rejectionBoxText}>{entry.entryReason}</p>
        </div>
      )}
    </div>
  );
}

// ── 상세 패널 ─────────────────────────────────────────────────
function DetailPanel({ app, onClose, onReapply }: { app: Application; onClose: () => void; onReapply?: () => void }) {
  const isMulti = app.categories.length > 1;
  const fieldType = getFieldType(app);
  const rejectedCount = getRejectedCount(app.entries);

  const byCategory = app.entries.reduce<Record<string, ApplicationEntry[]>>((acc, e) => {
    (acc[e.category] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className={styles.detail}>
      {/* ── 헤더 ── */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <StatusBadge status={app.status} />
          <span className={styles.detailApplyNo}>{app.applyNo}</span>
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={16} height={16}>
            <line x1="3" y1="3" x2="15" y2="15" /><line x1="15" y1="3" x2="3" y2="15" />
          </svg>
        </button>
      </div>

      <div className={styles.detailScroll}>
        {/* ── 상태 배너 ── */}
        <StatusBanner app={app} />

        <div className={styles.detailBody}>

          {/* ── 신청 요약 인포바 ── */}
          <div className={styles.infoBar}>
            <span className={styles.infoFieldType}>{fieldType}</span>
            <span className={styles.infoSep} />
            <span>{app.type}</span>
            <span className={styles.infoSep} />
            <span>{app.applyDate} 신청</span>
            <span className={styles.infoSep} />
            <span>
              총 {app.entries.length}점
              {rejectedCount > 0 && (
                <span className={styles.infoRejected}> · 반려 {rejectedCount}건</span>
              )}
            </span>
          </div>

          {/* ── 타임라인 ── */}
          <StatusTimeline status={app.status} />

          {/* ── 제출 실적 ── */}
          <section className={styles.entriesSection}>
            <h3 className={styles.entriesSectionTitle}>
              제출 실적 상세
              {app.status === "반려" && rejectedCount > 0 && (
                <span className={styles.entriesSectionHint}>항목별 반려 사유를 확인하세요</span>
              )}
            </h3>

            {isMulti ? (
              /* 복합 분야: 분야별 그룹 */
              app.categories.map((cat) => {
                const entries = byCategory[cat] ?? [];
                const catRejected = getRejectedCount(entries);
                return (
                  <div key={cat} className={styles.categorySection}>
                    <div className={styles.categorySectionHeader}>
                      <span className={styles.categorySectionIcon}>
                        <CategoryIcon category={cat} size={13} />
                      </span>
                      <span className={styles.categorySectionName}>{cat}</span>
                      <span className={styles.categorySectionCount}>{entries.length}점</span>
                      {catRejected > 0 && (
                        <span className={styles.categorySectionRejected}>반려 {catRejected}건</span>
                      )}
                    </div>
                    <div className={styles.entryList}>
                      {entries.map((entry, i) => (
                        <EntryCard key={i} entry={entry} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              /* 단일 분야: 평탄 목록 */
              <div className={styles.entryList}>
                {app.entries.map((entry, i) => (
                  <EntryCard key={i} entry={entry} index={i} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── 재신청 버튼 ── */}
      {app.status === "반려" && (
        <div className={styles.detailFooter}>
          <button type="button" className={styles.reapplyBtn} onClick={onReapply}>
            반려 사유 확인 후 재신청하기
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={13} height={13}>
              <line x1="3" y1="8" x2="13" y2="8" /><polyline points="9 4 13 8 9 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── 목록 아이템 ───────────────────────────────────────────────
function ListItem({ app, active, onClick }: { app: Application; active: boolean; onClick: () => void }) {
  const rejectedCount = getRejectedCount(app.entries);
  const fieldType = getFieldType(app);

  const statusBorderCls =
    app.status === "반려" ? styles.listItemRejected :
    app.status === "승인" ? styles.listItemApproved :
    styles.listItemPending;

  return (
    <button
      type="button"
      className={`${styles.listItem} ${statusBorderCls} ${active ? styles.listItemActive : ""}`}
      onClick={onClick}
      aria-current={active ? true : undefined}
    >
      {/* 위계 1: 단일/복합 + 심사 상태 */}
      <div className={styles.itemRow1}>
        <span className={styles.itemFieldType}>{fieldType}</span>
        <StatusBadge status={app.status} />
      </div>

      {/* 위계 2: 분야명 (핵심 식별자) */}
      <div className={styles.itemCategories}>
        {app.categories.map((cat) => (
          <span key={cat} className={styles.itemCategory}>
            <CategoryIcon category={cat} size={12} />
            {cat}
          </span>
        ))}
      </div>

      {/* 위계 3: 부가 메타 */}
      <div className={styles.itemMeta}>
        {app.type} · {app.applyDate} · {app.entries.length}점
      </div>

      {/* 위계 4: 반려 경보 */}
      {rejectedCount > 0 && (
        <div className={styles.itemAlert}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" width={10} height={10} aria-hidden="true">
            <circle cx="6" cy="6" r="5" />
            <line x1="6" y1="4" x2="6" y2="6.5" />
            <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
          </svg>
          {rejectedCount}건 반려 — 사유 확인 필요
        </div>
      )}
    </button>
  );
}

// ── 메인 ──────────────────────────────────────────────────────
export default function ApplicationStatusPage({ onReapply }: { onReapply?: () => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError("신청 현황을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${styles.layout} ${selected ? styles.withDetail : ""}`}>
      <div className={styles.listPanel}>
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>신청 현황</h2>
          {!loading && !error && <span className={styles.listCount}>총 {applications.length}건</span>}
        </div>

        {loading ? (
          <div className={styles.emptyState}><div className={styles.spinner} /><p>불러오는 중...</p></div>
        ) : error ? (
          <div className={styles.emptyState}><p>{error}</p></div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}><p>신청 내역이 없습니다.</p></div>
        ) : (
          <ul className={styles.list} role="list">
            {applications.map((app) => (
              <li key={app.id}>
                <ListItem
                  app={app}
                  active={selected?.id === app.id}
                  onClick={() => setSelected(selected?.id === app.id ? null : app)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected ? (
        <DetailPanel app={selected} onClose={() => setSelected(null)} onReapply={onReapply} />
      ) : (
        <div className={styles.emptyDetail}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" width={44} height={44} aria-hidden="true">
            <rect x="8" y="6" width="32" height="36" rx="3" />
            <line x1="14" y1="17" x2="34" y2="17" /><line x1="14" y1="24" x2="34" y2="24" /><line x1="14" y1="31" x2="24" y2="31" />
          </svg>
          <p>목록에서 신청 건을 선택하면<br />세부 정보를 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
