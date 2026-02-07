const ORDERS_KEY = "shop.orders.v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function nextId(orders) {
  const maxId = orders.reduce((m, o) => Math.max(m, Number(o?.id) || 0), 0);
  return maxId + 1;
}

export function loadOrders() {
  const raw = localStorage.getItem(ORDERS_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return Array.isArray(parsed) ? parsed : [];
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(Array.isArray(orders) ? orders : []));
}

export function ensureSeedOrders() {
  const existing = loadOrders();
  if (existing.length > 0) return existing;

  const now = Date.now();
  const seeded = [
    {
      id: 1,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: "PAID",
      totalQuantity: 2,
      totalPrice: 19800,
      items: [
        { productId: 1, name: "데일리 머그컵", price: 9900, quantity: 1, image: null },
        { productId: 2, name: "미니 수납 박스", price: 9900, quantity: 1, image: null },
      ],
    },
    {
      id: 2,
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      status: "PAID",
      totalQuantity: 3,
      totalPrice: 23700,
      items: [{ productId: 3, name: "주방 행주 세트", price: 7900, quantity: 3, image: null }],
    },
    {
      id: 3,
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      status: "PAID",
      totalQuantity: 1,
      totalPrice: 12900,
      items: [{ productId: 4, name: "데스크 매트", price: 12900, quantity: 1, image: null }],
    },
  ];

  saveOrders(seeded);
  return seeded;
}

export function createPaidOrderFromCart(cartItems, { totalQuantity, totalPrice }) {
  const orders = ensureSeedOrders();
  const id = nextId(orders);

  const items = cartItems.map((it) => {
    const price = Number(it.product?.price) || 0;
    return {
      productId: Number(it.productId),
      name: it.product?.name || `상품 #${it.productId}`,
      price,
      quantity: Number(it.quantity) || 1,
      image: it.product?.images?.[0] || null,
    };
  });

  const order = {
    id,
    createdAt: new Date().toISOString(),
    status: "PAID",
    totalQuantity: Number(totalQuantity) || 0,
    totalPrice: Number(totalPrice) || 0,
    items,
  };

  const next = [order, ...orders];
  saveOrders(next);
  return order;
}

export function findOrderById(orderId) {
  const id = Number(orderId);
  return loadOrders().find((o) => Number(o?.id) === id) || null;
}

