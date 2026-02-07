import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import { fetchOrder } from "../api/orders.js";

function formatWon(value) {
  try {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  } catch {
    return `${value}원`;
  }
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrder(id);
        if (!cancelled) setOrder(data);
      } catch (e) {
        if (!cancelled) setError(e);
        if (e?.message === "NOT_AUTHENTICATED") navigate("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  return (
    <div className="page">
      <SiteHeader />
      <main>
        <div className="sectionHeader">
          <h1 className="sectionTitle">주문 상세</h1>
          <p className="sectionDesc">
            <Link to="/orders/history">주문내역으로</Link>
          </p>
        </div>

        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && error.message !== "NOT_AUTHENTICATED" && (
          <p className="muted">주문 정보를 불러오지 못했습니다.</p>
        )}

        {!loading && !error && order && (
          <div className="detailLines">
            <div className="line">
              <span className="muted">주문번호</span>
              <span>#{order.id}</span>
            </div>
            <div className="line">
              <span className="muted">상태</span>
              <span>{order.status}</span>
            </div>
            <div className="line">
              <span className="muted">총액</span>
              <span>{formatWon(order.totalPrice)}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

