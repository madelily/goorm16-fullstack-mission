import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import { formatWon } from "../utils/format.js";
import SiteFooter from "../components/SiteFooter.jsx";
import { ensureSeedOrders, loadOrders } from "../orders/storage.js";

export default function OrderHistory() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        ensureSeedOrders();
        const data = loadOrders();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <SiteHeader />
      <main className="container pageMain">
        <div className="sectionHeader">
          <h1 className="sectionTitle">주문내역</h1>
          <p className="sectionDesc">가짜 결제로 생성된 주문을 확인할 수 있습니다.</p>
        </div>

        {loading && <p className="muted">로딩 중...</p>}
        {!loading && orders.length === 0 && (
          <div className="empty">
            <p className="emptyTitle">주문내역이 없습니다</p>
            <p className="muted">
              <Link to="/products">상품 보러가기</Link>
            </p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <ul className="list">
            {orders.map((o) => (
              <li key={o.id} className="listItem">
                <Link to={`/orders/history/${o.id}`} className="rowLink">
                  <div className="orderRow">
                    <div className="orderTop">
                      <span className="orderId">주문 #{o.id}</span>
                      <span className="orderStatus">{o.status === "PAID" ? "결제완료" : o.status}</span>
                    </div>
                    <div className="orderMeta">
                      <span className="muted">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString("ko-KR") : ""}
                      </span>
                      <span className="muted">총액 {formatWon(o.totalPrice)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
