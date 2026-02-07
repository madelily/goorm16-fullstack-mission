import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";
import SiteHeader from "../components/SiteHeader.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);

  useState(() => {
    const saved = localStorage.getItem("shop.auth.email");
    if (saved) setEmail(saved);
  });

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      if (rememberEmail) localStorage.setItem("shop.auth.email", email);
      else localStorage.removeItem("shop.auth.email");

      await login({ email, password });
      navigate("/products");
    } catch {
      alert("로그인에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <SiteHeader />

      <header className="header authHeader">
        <h1 className="title">로그인</h1>
        <p className="subtitle">
          계정이 없나요? <Link to="/signup">회원가입</Link>
          {" · "}
          <Link to="/password-reset">비밀번호 찾기</Link>
        </p>
      </header>

      <main className="authMain">
        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="label">이메일</span>
            <input
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span className="label">비밀번호</span>
            <input
              className="input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
            />
            <span className="checkText">이메일 기억하기</span>
          </label>

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "로그인 중..." : "로그인"}
          </button>

          <p className="hint">
            세션 기반 인증이므로 요청 시 <code>credentials: "include"</code>가
            필요합니다.
          </p>
        </form>
      </main>
    </div>
  );
}
