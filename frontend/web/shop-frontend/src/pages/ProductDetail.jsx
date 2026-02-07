import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("FETCH_PRODUCT_FAILED");
        const data = await res.json();
        if (!cancelled) setProduct(data);
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
  }, [id]);

  function onOrderClick() {
    navigate("/orders", { state: { productId: Number(id) } });
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">상품 상세</h1>
      </header>

      <main>
        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && <p className="muted">상품을 불러오지 못했습니다.</p>}

        {!loading && !error && product && (
          <div className="detail">
            <div className="detailTop">
              <div className="thumb detailThumb" aria-hidden="true" />
              <div className="detailTitle">
                <div className="detailName">{product.name}</div>
                <div className="detailPrice">{product.price}원</div>
              </div>
            </div>

            <div className="detailSection">
              <div className="detailLabel">설명</div>
              <div className="detailText">
                {product.description ? product.description : "설명이 없습니다."}
              </div>
            </div>

            <button className="button" type="button" onClick={onOrderClick}>
              주문하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

