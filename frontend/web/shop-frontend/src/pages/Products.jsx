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
      <header className="header">
        <h1 className="title">상품 목록</h1>
      </header>
      <main>
        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && <p className="muted">상품을 불러오지 못했습니다.</p>}
        {!loading && !error && products.length === 0 && (
          <p className="muted">상품이 없습니다</p>
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
