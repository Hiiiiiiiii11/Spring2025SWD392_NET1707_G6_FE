import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/Register/Register";
import ProductPage from "../pages/ProductPage/ProductPage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Manager from "../pages/ManageProduct/Manager";
import Login from "../pages/Login/Login";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import CustomerLayout from "../layout/CustomerLayout/CustomerLayout";
import Home from "../pages/Home/Home";
import CartPage from "../pages/Cart/CartPage";
import ManagerStaff from "../pages/ManagerStaff/ManagerStaff";
import CustomerOrders from "../pages/CustomerOrders";
import StaffOrders from "../pages/StaffOrders";
import ManagerOrders from "../pages/ManagerOrders";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <CartPage /> },
      // Route cho khách hàng xem đơn hàng
      { path: "/customer/orders", element: <CustomerOrders /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/manager",
    element: <Manager />, // Trang quản lý sản phẩm cho manager
    children: [
      { path: "orders", element: <ManagerOrders /> }, // Manager xem và quản lý đơn hàng
    ],
  },
  {
    path: "/manager-staff",
    element: <ManagerStaff />, // Trang cho nhân viên
    children: [
      { path: "orders", element: <StaffOrders /> }, // Nhân viên xem và xử lý đơn hàng
    ],
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/staff-orders", // Đường dẫn riêng để xem StaffOrders
    element: <StaffOrders />, // Chỉ hiển thị StaffOrders
  },
  {
    path: "/", // Đường dẫn mặc định (root) cũng redirect đến StaffOrders
    element: <StaffOrders />, // Chỉ hiển thị StaffOrders
  },
  {
    path: "/manager-orders", // Đường dẫn riêng để xem ManagerOrders
    element: <ManagerOrders />, // Chỉ hiển thị ManagerOrders
  },
  {
    path: "/", // Đường dẫn mặc định (root) cũng redirect đến ManagerOrders
    element: <ManagerOrders />, // Chỉ hiển thị ManagerOrders
  },
]);

export default AppRouter;