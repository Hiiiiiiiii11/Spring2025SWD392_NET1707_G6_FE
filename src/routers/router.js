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
import PaymentPage from "../pages/Payment/PaymentPage";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/customer/orders", element: <CustomerOrders /> },
      { path: "/payment", element: <PaymentPage /> }, // Thêm trang thanh toán
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/manager",
    element: <Manager />, 
    children: [
      { path: "orders", element: <ManagerOrders /> },
    ],
  },
  {
    path: "/manager-staff",
    element: <ManagerStaff />, 
    children: [
      { path: "orders", element: <StaffOrders /> },
    ],
  },
  {
    path: "/manager-orders",
    element: <ManagerOrders />,
  },
  {
    path: "/staff-orders",
    element: <StaffOrders />,
  },
]);

export default AppRouter;
