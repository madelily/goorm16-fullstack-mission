import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/users.js";
import SiteHeader from "../components/SiteHeader.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await signup({ email, password, name });
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (e2) {
      alert(e2?.message || "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <SiteHeader />

      <header className="header authHeader">
        <h1 className="title">회원가입</h1>
        <p className="subtitle">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
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
          </label>

          <label className="field">
            <span className="label">비밀번호</span>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">이름</span>
            <input
              className="input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "처리 중..." : "회원가입"}
          </button>
        </form>
      </main>
    </div>
  );
}
