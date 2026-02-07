import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOrder } from "../api/orders.js";
import { mockProducts } from "../mocks/mockProducts.js";
import { useCart } from "../cart/CartContext.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { formatWon } from "../utils/format.js";

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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [optionSelectValue, setOptionSelectValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (!id) return;

    const productId = Number(id);
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const mock = mockProducts.find((p) => p.id === productId);
          if (!mock) throw new Error("FETCH_PRODUCT_FAILED");
          if (!cancelled) setProduct(mock);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          if (data && Object.keys(data).length > 0) {
            setProduct(data);
          } else {
            const mock = mockProducts.find((p) => p.id === productId);
            setProduct(mock ?? null);
          }
        }
      } catch (e) {
        if (!cancelled) {
          const mock = mockProducts.find((p) => p.id === productId);
          if (mock) {
            setProduct(mock);
            setError(null);
          } else {
            setError(e);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setSelectedImageIdx(0);
    setOptionSelectValue("");
    setSelectedOptions([]);
  }, [product]);

  async function onOrderClick() {
    if (hasOptions && selectedOptions.length === 0) {
      alert("옵션을 선택해 주세요.");
      return;
    }

    if (ordering) return;
    setOrdering(true);
    try {
      await createOrder({ productId: Number(id), quantity: Math.max(1, totalQuantity), userId: 1 });
      navigate("/orders");
    } catch {
      alert("주문 생성에 실패했습니다.");
    } finally {
      setOrdering(false);
    }
  }

  function onCartClick() {
    cart.add(Number(id), Math.max(1, totalQuantity));
    alert("장바구니에 담았습니다.");
  }

  const images = product && Array.isArray(product.images) ? product.images : [];
  const mainImageSrc = images[selectedImageIdx] || images[0] || "";
  const galleryImages = images.slice(0, 3);
  const recommended = mockProducts
    .filter((p) => p.id !== Number(id))
    .slice(0, 4);

  const hasOptions = product && Array.isArray(product.options) && product.options.length > 0;
  const totalQuantity = hasOptions
    ? selectedOptions.reduce((sum, item) => sum + item.quantity, 0)
    : 1;
  const unitPrice = product?.price ?? 0;
  const totalPrice = unitPrice * totalQuantity;

  function addOption(option) {
    if (!option) return;
    if (selectedOptions.some((o) => o.option === option)) {
      alert("이미 선택한 옵션입니다.");
      return;
    }
    setSelectedOptions((prev) => [...prev, { option, quantity: 1 }]);
  }

  function updateOptionQuantity(option, delta) {
    setSelectedOptions((prev) =>
      prev.map((o) =>
        o.option === option ? { ...o, quantity: Math.max(1, o.quantity + delta) } : o,
      ),
    );
  }

  return (
    <div className="page">
      <SiteHeader />

      <main>
        {loading && <p className="muted">로딩 중...</p>}
        {!loading && error && <p className="muted">상품을 불러오지 못했습니다.</p>}

        {!loading && !error && product && (
          <>
            <section className="pdTop">
              <div>
                <div className="pdMainImage" aria-hidden="true">
                  {mainImageSrc ? (
                    <img
                      className="thumbImg"
                      src={mainImageSrc}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>

                {galleryImages.length > 1 ? (
                  <div className="pdThumbs" aria-label="상품 이미지 갤러리">
                    {galleryImages.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        className={`pdThumbBtn ${idx === selectedImageIdx ? "isActive" : ""}`}
                        onClick={() => setSelectedImageIdx(idx)}
                        aria-label={`이미지 ${idx + 1}`}
                      >
                        <img className="thumbImg" src={src} alt="" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="pdInfo">
                <h1 className="pdTitle">{product.name}</h1>

                <div className="pdUnitPrice">
                  <span className="pdLabel">단가</span>
                  <span className="pdUnitValue">{formatWon(unitPrice)}</span>
                </div>

                {hasOptions ? (
                  <label className="pdField">
                    <span className="pdLabel">옵션 선택</span>
                    <select
                      className="select"
                      value={optionSelectValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        addOption(value);
                        setOptionSelectValue("");
                      }}
                    >
                      <option value="" disabled>
                        옵션을 선택하세요
                      </option>
                      {product.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <div className="pdDivider" />

                {hasOptions ? (
                  <>
                    <div className="pdTableHeader" aria-hidden="true">
                      <span>선택 옵션</span>
                      <span>수량</span>
                    </div>

                    <div className="pdSelectedList" aria-label="선택 옵션 리스트">
                      {selectedOptions.length === 0 ? (
                        <div className="pdEmptyRow">
                          <span className="muted">옵션을 선택해 주세요.</span>
                        </div>
                      ) : (
                        selectedOptions.map((item) => (
                          <div key={item.option} className="pdSelectedItem">
                            <span className="pdSelectedName">{item.option}</span>
                            <div className="qtyControl" aria-label={`${item.option} 수량`}>
                              <button
                                type="button"
                                className="qtyButton"
                                onClick={() => updateOptionQuantity(item.option, -1)}
                                aria-label={`${item.option} 수량 감소`}
                              >
                                -
                              </button>
                              <span className="qtyValue">{item.quantity}</span>
                              <button
                                type="button"
                                className="qtyButton"
                                onClick={() => updateOptionQuantity(item.option, +1)}
                                aria-label={`${item.option} 수량 증가`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : null}

                <div className="pdDivider" />

                <div className="pdTotal">
                  <span className="pdTotalLabel">총 금액</span>
                  <span className="pdTotalValue">{formatWon(totalPrice)}</span>
                </div>

                <div className="pdActions">
                  <button type="button" className="button buttonSecondary" onClick={onCartClick}>
                    장바구니 담기
                  </button>
                  <button type="button" className="button" onClick={onOrderClick} disabled={ordering}>
                    {ordering ? "주문 생성 중..." : "바로 주문하기"}
                  </button>
                </div>
              </div>
            </section>

            <section className="pdSection">
              <h2 className="pdSectionTitle">상품 설명</h2>
              <div className="pdText">
                {product.description ? product.description : "설명이 없습니다."}
              </div>
              {images.length > 0 ? (
                <div className="pdWideImages" aria-label="상세 이미지">
                  {images.slice(0, 3).map((src, idx) => (
                    <img
                      key={`${src}-${idx}`}
                      className="pdWideImg"
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              ) : null}
            </section>

            <section className="pdSection">
              <h2 className="pdSectionTitle">추천 상품</h2>
              <ul className="grid">
                {recommended.map((p) => {
                  const colors = getColorOptions(p.options);
                  return (
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

                        {colors ? (
                          <div className="colorDots" aria-hidden="true">
                            {colors.map((c, idx) => (
                              <span
                                key={`${c}-${idx}`}
                                className="dot"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        ) : null}

                        <div className="productName">{p.name}</div>
                        <div className="productPrice">{formatWon(p.price)}</div>
                        <div className="productDesc">{p.shortDescription}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
