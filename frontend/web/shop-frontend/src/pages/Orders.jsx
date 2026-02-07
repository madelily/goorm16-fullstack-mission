import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext.jsx";
import { mockProducts } from "../mocks/mockProducts.js";
import SiteHeader from "../components/SiteHeader.jsx";
import { formatWon } from "../utils/format.js";
import SiteFooter from "../components/SiteFooter.jsx";
import { createPaidOrderFromCart } from "../orders/storage.js";

function asList(data) {
  return Array.isArray(data) ? data : [];
}

export default function Orders() {
  const navigate = useNavigate();
  const cart = useCart();

  const [catalog, setCatalog] = useState([]);
  const [payOpen, setPayOpen] = useState(false);

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

  function openPay() {
    if (cartItems.length === 0) return;
    setPayOpen(true);
  }

  function confirmMockPay() {
    const order = createPaidOrderFromCart(cartItems, {
      totalQuantity: cartTotalQuantity,
      totalPrice: cartTotalPrice,
    });
    cart.clear();
    setPayOpen(false);
    navigate(`/orders/history/${order.id}`);
  }

  return (
    <div className="page">
      <SiteHeader />
      <main className="container pageMain">
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

            <div className="orderSummary">
              <div className="summaryRow">
                <span className="muted">총 수량</span>
                <span>{cartTotalQuantity}개</span>
              </div>
              <div className="summaryRow">
                <span className="muted">총 금액</span>
                <span className="summaryPrice">{formatWon(cartTotalPrice)}</span>
              </div>
              <button type="button" className="button" onClick={openPay}>
                결제하기
              </button>
              <p className="hint">현재는 실제 결제가 진행되지 않습니다.</p>
            </div>
          </>
        )}
      </main>
      <SiteFooter />

      {payOpen ? (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="가짜 결제 안내">
          <div className="overlayPanel">
            <h2 className="overlayTitle">가짜 결제</h2>
            <p className="overlayText">
              현재는 실제 결제가 진행되지 않습니다.
              <br />
              확인 버튼을 누르면 결제가 완료된 것으로 처리됩니다.
            </p>
            <div className="overlayActions">
              <button type="button" className="button" onClick={confirmMockPay}>
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
