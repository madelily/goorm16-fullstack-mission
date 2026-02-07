import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mockProducts } from "../mocks/mockProducts.js";

function optionToColor(option) {
  const key = String(option || "").trim().toLowerCase();
  const map = {
    black: "#111827",
    white: "#ffffff",
    offwhite: "#f5f5f0",
    ivory: "#f4f1e6",
    cream: "#f3ead3",
    beige: "#d6c4a8",
    gray: "#9ca3af",
    silver: "#c0c7cf",
    charcoal: "#374151",
    navy: "#1f2a44",
    blue: "#2563eb",
    green: "#16a34a",
    red: "#dc2626",
  };
  return map[key] || null;
}

function getColorOptions(options) {
  if (!Array.isArray(options) || options.length === 0) return null;
  const colors = options.map(optionToColor);
  if (colors.some((c) => !c)) return null;
  return colors;
}

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products", { credentials: "include" });
        if (!res.ok) throw new Error("FETCH_PRODUCTS_FAILED");
        const data = await res.json();
        const next = Array.isArray(data) ? data : [];
        if (!cancelled) setProducts(next.length === 0 ? mockProducts : next);
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setProducts(mockProducts);
        }
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
      <header className="siteHeader">
        <Link to="/products" className="brand">
          Shop
        </Link>
        <nav className="nav">
          <Link to="/login" className="navLink">
            로그인
          </Link>
          <Link to="/orders" className="navLink">
            장바구니
          </Link>
          <Link to="/orders" className="navLink">
            주문내역
          </Link>
        </nav>
      </header>

      <main>
        <div className="sectionHeader">
          <h1 className="sectionTitle">상품</h1>
          <p className="sectionDesc">모바일 웹 쇼핑몰 메인 화면</p>
        </div>

        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && products.length === 0 && (
          <p className="muted">상품 준비 중입니다.</p>
        )}
        {!loading && products.length === 0 && (
          <div className="empty">
            <p className="emptyTitle">상품 준비 중입니다</p>
            <p className="muted">등록된 상품이 없습니다.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <ul className="grid">
            {products.map((p) => (
              <li key={p.id} className="gridItem">
                <Link to={`/products/${p.id}`} className="productCard">
                  <div className="productImage" aria-hidden="true">
                    {Array.isArray(p.images) && p.images[0] ? (
                      <img
                        className="thumbImg"
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>

                  {(() => {
                    const colors = getColorOptions(p.options);
                    if (!colors) return null;
                    return (
                    <div className="colorDots" aria-hidden="true">
                      {colors.map((c, idx) => (
                        <span
                          key={`${c}-${idx}`}
                          className="dot"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    );
                  })()}

                  <div className="productName">{p.name}</div>
                  <div className="productPrice">{p.price}원</div>
                  <div className="productDesc">
                    {p.shortDescription ? p.shortDescription : `재고 ${p.stock}`}
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
