import { useState, useEffect } from "react";
import styles from "./ApplicationStatusPage.module.css";
import type { Application, AppStatus } from "../api/types";
import { getApplications } from "../api/application";

const STATUS_CONFIG: Record<AppStatus, { label: string; className: string }> = {
  심사중: { label: "심사중", className: "badgePending" },
  승인:   { label: "승인",   className: "badgeApproved" },
  반려:   { label: "반려",   className: "badgeRejected" },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <span className={`${styles.badge} ${styles[cfg.className]}`}>{cfg.label}</span>;
}

function formatCategories(cats: string[]) {
  if (cats.length <= 2) return cats.join(" · ");
  return `${cats.slice(0, 2).join(" · ")} 외 ${cats.length - 2}개`;
}

interface DetailPanelProps {
  app: Application;
  onClose: () => void;
  onReapply?: () => void;
}

function DetailPanel({ app, onClose, onReapply }: DetailPanelProps) {
  const byCategory = app.entries.reduce<Record<string, typeof app.entries>>((acc, e) => {
    (acc[e.category] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <div className={styles.detailMeta}>
          <StatusBadge status={app.status} />
          <span className={styles.detailApplyNo}>{app.applyNo}</span>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="닫기"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={18} height={18}>
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>
      </div>

      <div className={styles.detailBody}>
        <section className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>신청 정보</h3>
          <dl className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <dt>신청 유형</dt>
              <dd>{app.type}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>신청 분야</dt>
              <dd>{app.categories.join(", ")}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>신청일</dt>
              <dd>{app.applyDate}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>처리일</dt>
              <dd>{app.statusDate}</dd>
            </div>
          </dl>
        </section>

        {app.status === "반려" && app.reason && (
          <section className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>반려 사유</h3>
            <div className={styles.reasonBox}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" width={16} height={16} aria-hidden="true">
                <circle cx="10" cy="10" r="8" />
                <line x1="10" y1="6" x2="10" y2="11" />
                <circle cx="10" cy="14" r="0.5" fill="currentColor" />
              </svg>
              <p>{app.reason}</p>
            </div>
          </section>
        )}

        <section className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>제출 실적</h3>
          {Object.entries(byCategory).map(([cat, entries]) => (
            <div key={cat} className={styles.categoryBlock}>
              <h4 className={styles.categoryLabel}>{cat}</h4>
              <div className={styles.entryList}>
                {entries.map((entry, i) => (
                  <div key={i} className={styles.entryItem}>
                    <div className={styles.entryNum}>{i + 1}</div>
                    <div className={styles.entryContent}>
                      <span className={styles.entryTitle}>{entry.title}</span>
                      <div className={styles.entryMeta}>
                        <span>{entry.publisher}</span>
                        <span className={styles.metaDot}>·</span>
                        <span>{entry.genre}</span>
                        <span className={styles.metaDot}>·</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                    <div className={styles.entryFiles}>
                      <span className={styles.fileTag}>표지</span>
                      <span className={styles.fileTag}>내지</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {app.status === "반려" && (
        <div className={styles.detailFooter}>
          <button type="button" className={styles.reapplyBtn} onClick={onReapply}>
            재신청하기
          </button>
        </div>
      )}
    </div>
  );
}

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
          {!loading && !error && (
            <span className={styles.listCount}>총 {applications.length}건</span>
          )}
        </div>

        {loading ? (
          <div className={styles.emptyDetail}>
            <p>불러오는 중...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyDetail}>
            <p>{error}</p>
          </div>
        ) : (
          <ul className={styles.list} role="list">
            {applications.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  className={`${styles.listItem} ${selected?.id === app.id ? styles.listItemActive : ""}`}
                  onClick={() => setSelected(selected?.id === app.id ? null : app)}
                  aria-current={selected?.id === app.id ? true : undefined}
                >
                  <div className={styles.itemTop}>
                    <span className={styles.itemCategories}>{formatCategories(app.categories)}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className={styles.itemMid}>
                    <span className={styles.itemType}>{app.type}</span>
                    <span className={styles.itemDot}>·</span>
                    <span className={styles.itemDate}>{app.applyDate}</span>
                  </div>
                  {app.status === "반려" && app.reason && (
                    <p className={styles.itemReason}>{app.reason}</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected ? (
        <DetailPanel app={selected} onClose={() => setSelected(null)} onReapply={onReapply} />
      ) : (
        <div className={styles.emptyDetail}>
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" width={48} height={48} aria-hidden="true">
            <rect x="8" y="6" width="32" height="36" rx="3" />
            <line x1="16" y1="16" x2="32" y2="16" />
            <line x1="16" y1="22" x2="32" y2="22" />
            <line x1="16" y1="28" x2="24" y2="28" />
          </svg>
          <p>목록에서 신청 건을 선택하면<br />세부 정보를 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
