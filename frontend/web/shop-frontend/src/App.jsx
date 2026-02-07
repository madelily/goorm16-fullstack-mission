import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
