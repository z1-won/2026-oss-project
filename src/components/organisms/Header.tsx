import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.top}>
          <span className={styles.logo}>서비스 이름이 여기</span>
          <div className={styles.userMenu}>
            <span>회원가입</span>
            <span>로그인</span>
            <span>마이페이지</span>
          </div>
        </div>
      </header>
      <nav className={styles.nav}>
        <span>회원가입</span>
        <span>비밀번호 찾기</span>
        <span>정책 안내 바로가기</span>
        <span>비밀번호 찾기</span>
      </nav>
    </>
  );
}
