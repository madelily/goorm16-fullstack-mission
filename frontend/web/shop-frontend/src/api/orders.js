const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const DEFAULT_USER_ID = 1;
const DEFAULT_QUANTITY = 1;

export async function createOrder({ productId, userId = DEFAULT_USER_ID, quantity = DEFAULT_QUANTITY }) {
  const params = new URLSearchParams();
  params.set("userId", String(userId));
  params.set("productId", String(productId));
  params.set("quantity", String(quantity));

  const res = await fetch(`${API_BASE_URL}/api/orders?${params.toString()}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("CREATE_ORDER_FAILED");
  }

  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("FETCH_ORDERS_FAILED");
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    throw new Error("NOT_AUTHENTICATED");
  }

  return res.json();
}

