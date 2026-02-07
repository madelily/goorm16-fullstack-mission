import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("RESET_FAILED");

      alert("임시 비밀번호를 이메일로 전송했습니다. 메일함을 확인해 주세요.");
      navigate("/login");
    } catch {
      alert("요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <SiteHeader />

      <header className="header authHeader">
        <h1 className="title">비밀번호 찾기</h1>
        <p className="subtitle">
          로그인으로 돌아가기: <Link to="/login">로그인</Link>
        </p>
      </header>

      <main className="authMain">
        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="label">이메일</span>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="hint">
              가입한 이메일로 임시 비밀번호가 전송됩니다.
            </span>
          </label>

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "처리 중..." : "임시 비밀번호 받기"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
