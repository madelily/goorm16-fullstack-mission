import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext.jsx";

export default function SiteHeader() {
  const cart = useCart();

  return (
    <header className="siteHeader">
      <Link to="/products" className="brand">
        Shop
      </Link>
      <nav className="nav">
        <Link to="/login" className="navLink">
          로그인
        </Link>
        <Link to="/orders" className="navLink">
          장바구니 <span className="badge">{cart.totalCount}</span>
        </Link>
        <Link to="/orders" className="navLink">
          주문내역
        </Link>
      </nav>
    </header>
  );
}

