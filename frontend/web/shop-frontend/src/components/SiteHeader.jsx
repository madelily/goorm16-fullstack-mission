import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext.jsx";
import { LogIn, ReceiptText, ShoppingCart } from "lucide-react";

export default function SiteHeader() {
  const cart = useCart();

  return (
    <header className="siteHeader">
      <Link to="/products" className="brand">
        <ShoppingCart className="brandIcon" aria-hidden="true" />
        <span>Shop</span>
      </Link>
      <nav className="nav">
        <Link to="/login" className="iconLink" aria-label="로그인">
          <LogIn className="icon" aria-hidden="true" />
        </Link>
        <Link to="/orders" className="iconLink cartLink" aria-label="장바구니">
          <ShoppingCart className="icon" aria-hidden="true" />
          <span className="cartBadge" aria-label={`장바구니 상품 ${cart.itemCount}개`}>
            {cart.itemCount}
          </span>
        </Link>
        <Link to="/orders/history" className="iconLink" aria-label="주문내역">
          <ReceiptText className="icon" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
