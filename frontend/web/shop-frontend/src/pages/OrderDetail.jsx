import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import { formatWon } from "../utils/format.js";
import SiteFooter from "../components/SiteFooter.jsx";
import { ensureSeedOrders, findOrderById } from "../orders/storage.js";

export default function OrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        ensureSeedOrders();
        const found = findOrderById(id);
        if (!cancelled) setOrder(found);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="page">
      <SiteHeader />
      <main className="container pageMain">
        <div className="sectionHeader">
          <h1 className="sectionTitle">주문 상세</h1>
          <p className="sectionDesc">
            <Link to="/orders/history">주문내역으로</Link>
          </p>
        </div>

        {loading && <p className="muted">로딩 중...</p>}
        {!loading && !order && <p className="muted">주문 정보를 찾을 수 없습니다.</p>}

        {!loading && order ? (
          <>
            <div className="detailLines">
              <div className="line">
                <span className="muted">주문번호</span>
                <span>#{order.id}</span>
              </div>
              <div className="line">
                <span className="muted">주문일자</span>
                <span>{order.createdAt ? new Date(order.createdAt).toLocaleString("ko-KR") : "-"}</span>
              </div>
              <div className="line">
                <span className="muted">상태</span>
                <span>{order.status === "PAID" ? "결제완료" : order.status}</span>
              </div>
              <div className="line">
                <span className="muted">결제 금액</span>
                <span>{formatWon(order.totalPrice)}</span>
              </div>
            </div>

            <div className="sectionHeader sectionHeaderTight">
              <h2 className="sectionTitle">주문 상품</h2>
              <p className="sectionDesc">주문 상품 목록 요약</p>
            </div>

            <ul className="list">
              {(Array.isArray(order.items) ? order.items : []).map((it) => (
                <li key={`${it.productId}-${it.name}`} className="listItem">
                  <div className="orderItemRow">
                    <span className="orderItemName">{it.name}</span>
                    <span className="muted">
                      {it.quantity}개 · {formatWon((Number(it.price) || 0) * (Number(it.quantity) || 0))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pageActions">
              <Link className="button" to="/orders/history">
                주문내역으로 이동
              </Link>
            </div>
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
