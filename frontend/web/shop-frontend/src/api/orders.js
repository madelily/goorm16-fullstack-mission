const DEFAULT_USER_ID = 1;
const DEFAULT_QUANTITY = 1;

export async function createOrder({ productId, userId = DEFAULT_USER_ID, quantity = DEFAULT_QUANTITY }) {
  const params = new URLSearchParams();
  params.set("userId", String(userId));
  params.set("productId", String(productId));
  params.set("quantity", String(quantity));

  const res = await fetch(`/api/orders?${params.toString()}`, {
    method: "POST",
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("NOT_AUTHENTICATED");
  }
  if (!res.ok) {
    throw new Error("CREATE_ORDER_FAILED");
  }

  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`/api/orders`, {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("NOT_AUTHENTICATED");
  }
  if (!res.ok) {
    throw new Error("FETCH_ORDERS_FAILED");
  }

  return res.json();
}

export async function fetchOrder(orderId) {
  const res = await fetch(`/api/orders/${orderId}`, {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("NOT_AUTHENTICATED");
  }
  if (!res.ok) {
    throw new Error("FETCH_ORDER_FAILED");
  }

  return res.json();
}
