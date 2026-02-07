import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../api/orders.js";

export default function Orders() {
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
      <header className="header">
        <h1 className="title">주문</h1>
      </header>
      <main>
        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && error.message !== "NOT_AUTHENTICATED" && (
          <p className="muted">주문을 불러오지 못했습니다.</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="muted">주문이 없습니다</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <ul className="list">
            {orders.map((o) => (
              <li key={o.id} className="listItem">
                <div className="orderRow">
                  <div className="orderTop">
                    <span className="orderId">주문 #{o.id}</span>
                    <span className="orderStatus">{o.status}</span>
                  </div>
                  <div className="orderMeta">
                    <span className="muted">총액 {o.totalPrice}원</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
