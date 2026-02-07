import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
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
      <header className="header">
        <h1 className="title">로그인</h1>
        <p className="subtitle">이메일과 비밀번호로 로그인하세요.</p>
      </header>

      <main className="card">
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

