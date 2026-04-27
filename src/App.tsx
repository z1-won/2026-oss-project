import { useState } from "react";
import Header from "./components/organisms/Header";
import Footer from "./components/organisms/Footer";
import ArtPassLogo from "./components/common/ArtPassLogo";
import { useAuth } from "./context/AuthContext";
import MainPage from "./pages/MainPage";
import ApplyPage from "./pages/ApplyPage";
import ApplicationStatusPage from "./pages/ApplicationStatusPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import ScrollToTop from "./components/common/ScrollToTop";
import { PersonIcon, LoginIcon, LogoutIcon, MyPageIcon } from "./components/common/icons";
import "./App.css";
import { NAV_ITEMS_CONFIG, PROTECTED_PAGES, POLICY_LINKS, FAMILY_SITES, type Page } from "./constants/navigation";

export default function App() {
  const [page, setPage] = useState<Page>("main");
  const [prevPage, setPrevPage] = useState<Page>("main");
  const [pendingPage, setPendingPage] = useState<Page | null>(null);
  const { isLoggedIn, logout } = useAuth();

  const navigateTo = (target: Page) => {
    if (PROTECTED_PAGES.includes(target) && !isLoggedIn) {
      setPendingPage(target);
      setPage("login");
      return;
    }
    setPrevPage(page);
    setPage(target);
  };

  const handlePostLogin = () => {
    setPage(pendingPage ?? "main");
    setPendingPage(null);
  };

  const handleLogout = () => {
    logout();
    setPage("main");
  };

  const navItems = NAV_ITEMS_CONFIG.map((item) => ({
    label: item.label,
    href: "#",
    active: item.page === page,
    onClick: item.page ? (e: React.MouseEvent) => {
      e.preventDefault();
      navigateTo(item.page!);
    } : undefined,
  }));

  const utilityItems = isLoggedIn
    ? [
        { label: "마이페이지", href: "#", icon: <MyPageIcon />, onClick: () => navigateTo("mypage") },
        { label: "로그아웃",   href: "#", icon: <LogoutIcon />, onClick: handleLogout },
      ]
    : [
        { label: "회원가입", href: "#", icon: <PersonIcon />, onClick: () => setPage("signup") },
        { label: "로그인",   href: "#", icon: <LoginIcon />,  onClick: () => setPage("login") },
      ];

  const sharedHeader = (
    <Header
      serviceName="아트패스 artPass"
      logo={<ArtPassLogo />}
      navItems={navItems}
      utilityItems={utilityItems}
      onLogoClick={() => setPage("main")}
    />
  );

  const scrollToTop = <ScrollToTop />;

  const sharedFooter = (
    <Footer
      serviceName="아트패스 artPass"
      orgName="공개SW프로젝트 1분반"
      address="컴퓨터공학전공"
      tel="044-000-0000"
      fax="044-000-0001"
      policyLinks={POLICY_LINKS}
      familySites={FAMILY_SITES}
    />
  );

  if (page === "main") {
    return (
      <div className="page">
        {sharedHeader}
        <main id="main-content">
          <MainPage onApply={() => navigateTo("apply")} onStatus={() => navigateTo("status")} />
        </main>
        {sharedFooter}
        {scrollToTop}
      </div>
    );
  }

  if (page === "apply") {
    return (
      <div className="page">
        {sharedHeader}
        <main id="main-content" className="applyPage">
          <ApplyPage onGoToMyPage={() => navigateTo("mypage")} onGoToStatus={() => navigateTo("status")} />
        </main>
        {sharedFooter}
        {scrollToTop}
      </div>
    );
  }

  if (page === "status") {
    return (
      <div className="page pageStatus">
        {sharedHeader}
        <main id="main-content" className="statusPage">
          <ApplicationStatusPage onReapply={() => navigateTo("apply")} />
        </main>
        {sharedFooter}
        {scrollToTop}
      </div>
    );
  }

  if (page === "signup") {
    return (
      <div className="page">
        {sharedHeader}
        <main id="main-content" className="applyPage">
          <SignupPage onComplete={() => setPage("main")} onCancel={() => setPage("main")} />
        </main>
        {sharedFooter}
        {scrollToTop}
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="page">
        {sharedHeader}
        <main id="main-content" className="applyPage">
          <LoginPage
            onSuccess={handlePostLogin}
            onCancel={() => { setPendingPage(null); setPage("main"); }}
            onSignup={() => setPage("signup")}
          />
        </main>
        {sharedFooter}
        {scrollToTop}
      </div>
    );
  }

  if (page === "mypage") {
    return (
      <div className="page">
        {sharedHeader}
        <main id="main-content" className="applyPage">
          <MyPage onBack={() => setPage(prevPage)} />
        </main>
        {sharedFooter}
        {scrollToTop}
      </div>
    );
  }

  return null;
}
