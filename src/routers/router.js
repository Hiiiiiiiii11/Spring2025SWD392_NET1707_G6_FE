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
import PrivateRoute from "./privateRouter";
import BatchManagement from "../pages/ManageBatch/BatchManagement";
import Blog from "../components/Blog/Blog";
import News from "../components/News/News";
import FAQ from "../components/FAQ/FAQ";
import ProfileDetail from "../pages/Profile/ProfileDetail";
import SkinTypeQuiz from "../components/SkinTypeQuiz/SkinTypeQuiz";
import CompareProducts from "../components/CompareProduct/CompareProducts";
import ManageOrders from "../pages/ManageOrder/ManageOrders";
import UserProfile from "../pages/Profile/ProfileDetail";
import ViewOrderDetail from "../pages/ViewOrderDetail";
import ManagePromotion from "../pages/ManagePromotion/ManagePromotion";
import CustomerHistoryOrder from "../pages/CustomerHistoryOrder/CustomerHistoryOrder";
import ViewCartProductDetail from "../pages/CartDetail/ViewCartProductDetail";
import OrderConfirmationPage from "../pages/OrderConfirm/OrderConfirmationPage";
import ManageQuiz from "../pages/ManageQuiz/ManageQuiz";
import PaymentReturnPage from "../pages/PaymentReturnPage";
import RefundForm from "../components/FormRefund/FormRefund";



const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/manage_product", element: <PrivateRoute element={<Manager />} allowedRoles={["MANAGER"]} /> },
      { path: "/products", element: <PrivateRoute element={<ProductPage />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
      { path: "/product/:id", element: <PrivateRoute element={<ProfileDetail />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
      { path: "/cart", element: <PrivateRoute element={<CartPage />} allowedRoles={["CUSTOMER"]} /> },
      // { path: "/customer/orders", element: <PrivateRoute element={<OrderPage />} allowedRoles={["CUSTOMER"]} /> },
      { path: "/historyorders", element: <PrivateRoute element={<CustomerHistoryOrder />} allowedRoles={["CUSTOMER"]} /> },
      { path: "/promotion", element: <ManagePromotion /> },
      { path: "/skin-type-quiz", element: <SkinTypeQuiz /> },
      { path: "/compare-products", element: <CompareProducts /> },
      { path: "/blog", element: <Blog /> },
      { path: "/news", element: <News /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/profile", element: <UserProfile /> },
      { path: "/view-order-detail", element: <ViewOrderDetail /> },
      { path: "/manage-batch/:productID", element: <PrivateRoute element={<BatchManagement />} allowedRoles={["MANAGER"]} /> },
      { path: "/view-cart-product-detail", element: <ViewCartProductDetail /> },
      { path: "/order-confirmation", element: <PrivateRoute element={<OrderConfirmationPage />} allowedRoles={["CUSTOMER"]} /> },

      { path: "/payment/return", element: <PrivateRoute element={<PaymentReturnPage />} allowedRoles={["CUSTOMER"]} /> },
      { path: "/manage-staff", element: <PrivateRoute element={<ManagerStaff />} allowedRoles={["MANAGER"]} /> },
      { path: "/manage-quiz", element: <PrivateRoute element={<ManageQuiz />} allowedRoles={["MANAGER"]} /> },
      { path: "/manager-orders", element: <ManageOrders />, },

      { path: "/products/:id", element: <PrivateRoute element={<ProductDetail />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
    ],
  },
  { path: "/refund", element: <RefundForm /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

]);

export default AppRouter;
