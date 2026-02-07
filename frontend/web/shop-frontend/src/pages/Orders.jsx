import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders } from "../api/orders.js";
import { useCart } from "../cart/CartContext.jsx";
import { mockProducts } from "../mocks/mockProducts.js";
import SiteHeader from "../components/SiteHeader.jsx";

function formatWon(value) {
  try {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  } catch {
    return `${value}원`;
  }
}

function asList(data) {
  return Array.isArray(data) ? data : [];
}

export default function Orders() {
  const cart = useCart();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const res = await fetch("/api/products", { credentials: "include" });
        if (!res.ok) throw new Error("FETCH_PRODUCTS_FAILED");
        const data = await res.json();
        const next = asList(data);
        if (!cancelled) setCatalog(next.length === 0 ? mockProducts : next);
      } catch {
        if (!cancelled) setCatalog(mockProducts);
      }
    }

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders();
        if (!cancelled) setOrders(asList(data));
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const byId = new Map(catalog.map((p) => [Number(p.id), p]));
  const cartItems = cart.cart.items.map((it) => {
    const product = byId.get(it.productId) || null;
    return { ...it, product };
  });
  const cartTotalQuantity = cart.cart.items.reduce((sum, it) => sum + it.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, it) => {
    const price = Number(it.product?.price) || 0;
    return sum + price * it.quantity;
  }, 0);

  return (
    <div className="page">
      <SiteHeader />
      <main>
        <div className="sectionHeader">
          <h1 className="sectionTitle">장바구니</h1>
          <p className="sectionDesc">비로그인 상태에서도 담은 상품이 유지됩니다.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty">
            <p className="emptyTitle">장바구니가 비어있습니다</p>
            <p className="muted">원하는 상품을 담아보세요.</p>
            <p className="muted">
              <Link to="/products">상품 보러가기</Link>
            </p>
          </div>
        ) : (
          <>
            <div className="cartSummary">
              <span className="muted">총 {cartTotalQuantity}개</span>
              <span className="cartTotal">{formatWon(cartTotalPrice)}</span>
            </div>

            <ul className="cartList">
              {cartItems.map((it) => (
                <li key={it.productId} className="cartItem">
                  <div className="cartThumb" aria-hidden="true">
                    {it.product?.images?.[0] ? (
                      <img
                        className="thumbImg"
                        src={it.product.images[0]}
                        alt={it.product?.name || ""}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>

                  <div className="cartBody">
                    <div className="cartTop">
                      <span className="cartName">{it.product?.name || `상품 #${it.productId}`}</span>
                      <button
                        type="button"
                        className="linkButton"
                        onClick={() => cart.remove(it.productId)}
                      >
                        삭제
                      </button>
                    </div>
                    <div className="cartMeta">
                      <span className="muted">단가 {formatWon(Number(it.product?.price) || 0)}</span>
                    </div>
                    <div className="cartBottom">
                      <div className="qtyControl" aria-label="수량">
                        <button
                          type="button"
                          className="qtyButton"
                          onClick={() => cart.setQuantity(it.productId, Math.max(1, it.quantity - 1))}
                          aria-label="수량 감소"
                        >
                          -
                        </button>
                        <span className="qtyValue">{it.quantity}</span>
                        <button
                          type="button"
                          className="qtyButton"
                          onClick={() => cart.setQuantity(it.productId, it.quantity + 1)}
                          aria-label="수량 증가"
                        >
                          +
                        </button>
                      </div>
                      <span className="cartLineTotal">
                        {formatWon((Number(it.product?.price) || 0) * it.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="sectionHeader sectionHeaderTight">
          <h2 className="sectionTitle">주문내역</h2>
          <p className="sectionDesc">로그인한 경우에만 조회됩니다.</p>
        </div>

        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && error.message === "NOT_AUTHENTICATED" && (
          <p className="muted">
            주문내역을 보려면 <Link to="/login">로그인</Link>이 필요합니다.
          </p>
        )}
        {!loading && error && error.message !== "NOT_AUTHENTICATED" && (
          <p className="muted">주문내역을 불러오지 못했습니다.</p>
        )}
        {!loading && !error && orders.length === 0 && <p className="muted">주문이 없습니다</p>}

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
