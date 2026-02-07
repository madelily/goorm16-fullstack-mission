import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e);
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
        {!loading && error && (
          <p className="muted">현재 상품을 불러올 수 없습니다.</p>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="empty">
            <p className="emptyTitle">상품 준비 중입니다</p>
            <p className="muted">등록된 상품이 없습니다.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <ul className="list">
            {products.map((p) => (
              <li key={p.id} className="listItem">
                <Link to={`/products/${p.id}`} className="listItemLink">
                  <div className="thumb" aria-hidden="true" />
                  <div className="itemBody">
                    <div className="itemTop">
                      <span className="itemName">{p.name}</span>
                      <span className="itemPrice">{p.price}원</span>
                    </div>
                    <div className="itemMeta">
                      <span className="muted">재고 {p.stock}</span>
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
