import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import { fetchOrders } from "../api/orders.js";

function formatWon(value) {
  try {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  } catch {
    return `${value}원`;
  }
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
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
  }, [navigate]);

  return (
    <div className="page">
      <SiteHeader />
      <main>
        <div className="sectionHeader">
          <h1 className="sectionTitle">주문내역</h1>
          <p className="sectionDesc">로그인한 사용자만 조회할 수 있습니다.</p>
        </div>

        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && error.message !== "NOT_AUTHENTICATED" && (
          <p className="muted">주문내역을 불러오지 못했습니다.</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="empty">
            <p className="emptyTitle">주문내역이 없습니다</p>
            <p className="muted">
              <Link to="/products">상품 보러가기</Link>
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <ul className="list">
            {orders.map((o) => (
              <li key={o.id} className="listItem">
                <Link to={`/orders/history/${o.id}`} className="rowLink">
                  <div className="orderRow">
                    <div className="orderTop">
                      <span className="orderId">주문 #{o.id}</span>
                      <span className="orderStatus">{o.status}</span>
                    </div>
                    <div className="orderMeta">
                      <span className="muted">총액 {formatWon(o.totalPrice)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

