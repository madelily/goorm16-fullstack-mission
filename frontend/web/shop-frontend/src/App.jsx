import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      {/* 공개 페이지 */}
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 로그인 필요 (서버에서 보호됨) */}
      <Route path="/orders" element={<Orders />} />

      {/* 그 외 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
