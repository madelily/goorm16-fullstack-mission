const CART_KEY = "shop.cart.v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  const parsed = raw ? safeParse(raw) : null;

  const items = Array.isArray(parsed?.items) ? parsed.items : [];
  return {
    items: items
      .filter(
        (it) =>
          Number.isFinite(Number(it?.productId)) &&
          Number.isFinite(Number(it?.quantity)),
      )
      .map((it) => ({
        productId: Number(it.productId),
        quantity: Math.max(1, Number(it.quantity)),
      })),
    updatedAt: Number(parsed?.updatedAt) || Date.now(),
  };
}

export function saveCart(cart) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify({ items: cart.items, updatedAt: Date.now() }),
  );
}

export function addToCart(productId, qty = 1) {
  const cart = loadCart();
  const pid = Number(productId);
  const quantity = Math.max(1, Number(qty) || 1);

  const found = cart.items.find((it) => it.productId === pid);
  if (found) found.quantity += quantity;
  else cart.items.push({ productId: pid, quantity });

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const pid = Number(productId);
  const cart = loadCart();
  cart.items = cart.items.filter((it) => it.productId !== pid);
  saveCart(cart);
  return cart;
}

export function setCartQuantity(productId, qty) {
  const pid = Number(productId);
  const quantity = Math.max(1, Number(qty) || 1);
  const cart = loadCart();

  const found = cart.items.find((it) => it.productId === pid);
  if (!found) return cart;

  found.quantity = quantity;
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function cartKey() {
  return CART_KEY;
}

