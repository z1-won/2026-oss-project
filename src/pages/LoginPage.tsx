import { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import styles from "./LoginPage.module.css";
import { useAuth } from "../context/AuthContext";
import { MOCK_CREDENTIALS } from "../api/auth";
import { EyeIcon } from "../components/common/icons";

interface LoginPageProps {
  onSuccess: () => void;
  onCancel: () => void;
  onSignup: () => void;
}

export default function LoginPage({ onSuccess, onCancel, onSignup }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // TODO: login()은 AuthContext에서 관리 — 백엔드 연동 시 내부만 교체
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* 헤더 */}
        <div className={styles.cardHeader}>
          <div className={styles.logoMark} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
              <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" />
              <path d="M4 10l12 6 12-6" />
              <line x1="16" y1="16" x2="16" y2="28" />
            </svg>
          </div>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>아트패스 서비스에 오신 것을 환영합니다.</p>
        </div>

        {/* 폼 */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">이메일</label>
            <Input
              id="login-email"
              type="email"
              error={!!error}
              placeholder="example@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="login-pw">비밀번호</label>
              <button type="button" className={styles.forgotBtn}>비밀번호 찾기</button>
            </div>
            <div className={styles.inputWrap}>
              <Input
                id="login-pw"
                type={showPw ? "text" : "password"}
                error={!!error}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                autoComplete="current-password"
                style={{ paddingRight: 46 }}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon visible={showPw} />
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" width={16} height={16}>
                <circle cx="10" cy="10" r="8" />
                <line x1="10" y1="6" x2="10" y2="11" />
                <circle cx="10" cy="14" r="0.5" fill="currentColor" strokeWidth={2} />
              </svg>
              {error}
            </div>
          )}

          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className={styles.rememberLabel}>로그인 상태 유지</span>
          </label>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            로그인
          </Button>
        </form>

        {/* 구분선 */}
        <div className={styles.divider}>
          <span>또는</span>
        </div>

        {/* 간편 로그인 */}
        <div className={styles.socialSection}>
          <p className={styles.socialLabel}>간편 로그인</p>
          <div className={styles.socialGrid}>
            <button type="button" className={`${styles.socialBtn} ${styles.kakao}`}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.552 1.53 4.8 3.85 6.197l-.98 3.645a.25.25 0 0 0 .373.277L9.77 18.18A11.7 11.7 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
              </svg>
              카카오
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.naver}`}>
              <span className={styles.naverN}>N</span>
              네이버
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.google}`}>
              <svg viewBox="0 0 24 24" width={18} height={18}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className={styles.footer}>
          <span className={styles.footerText}>아직 회원이 아니신가요?</span>
          <button type="button" className={styles.signupLink} onClick={onSignup}>
            회원가입
          </button>
          <span className={styles.footerDot}>·</span>
          <button type="button" className={styles.cancelLink} onClick={onCancel}>
            취소
          </button>
        </div>

        {/* 데모 안내 */}
        <div className={styles.demoHint}>
          <span>데모 계정:</span>
          <code>{MOCK_CREDENTIALS.email}</code>
          <span>/</span>
          <code>{MOCK_CREDENTIALS.password}</code>
        </div>
      </div>
    </div>
  );
}
