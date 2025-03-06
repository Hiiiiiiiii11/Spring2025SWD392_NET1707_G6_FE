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
import PaymentPage from "../pages/Payment/PaymentPage";
import PrivateRoute from "./privateRouter";
import BatchManagement from "../pages/ManageBatch/BatchManagement";
import Blog from "../components/Blog/Blog";
import News from "../components/News/News";
import FAQ from "../components/FAQ/FAQ";
import ProfileDetail from "../pages/Profile/ProfileDetail";
import Promotion from "../pages/ManagePromotion/Promotion";
import SkinTypeQuiz from "../components/SkinTypeQuiz/SkinTypeQuiz";
import CompareProducts from "../components/CompareProduct/CompareProducts";
import OrderPage from "../pages/OrderPage/CustomerOrders";
import ManageOrders from "../pages/ManageOrder/ManageOrders";
import UserProfile from "../pages/Profile/ProfileDetail";
import PromotionManage from "../pages/PromotionManage";


const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/manage_product",
        element: <PrivateRoute element={<Manager />} allowedRoles={["MANAGER"]} />
      },
      { path: "/products", element: <PrivateRoute element={<ProductPage />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
      { path: "/product/:id", element: <PrivateRoute element={<ProfileDetail />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
      { path: "/cart", element: <PrivateRoute element={<CartPage />} allowedRoles={["CUSTOMER"]} /> },
      { path: "/customer/orders", element: <PrivateRoute element={<OrderPage />} allowedRoles={["CUSTOMER"]} /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/promotion", element: <Promotion /> },
      { path: "/skin-type-quiz", element: <SkinTypeQuiz /> },
      { path: "/compare-products", element: <CompareProducts /> },
      { path: "/blog", element: <Blog /> },
      { path: "/news", element: <News /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/profile", element: <UserProfile /> },
      { path: "/promotions", element: <PromotionManage/>},
      { path: "/manage-batch/:productID", element: <PrivateRoute element={<BatchManagement />} allowedRoles={["MANAGER"]} /> },

      {
        path: "/manage-staff",
        element: <PrivateRoute element={<ManagerStaff />} allowedRoles={["MANAGER"]} />
      },
      {
        path: "/manager-orders",
        element: <ManageOrders />,
      },
      {
        path: "/forgot-password",
        element: <PrivateRoute element={<ForgotPassword />} allowedRoles={["GUEST"]} />
      },
      { path: "/products/:id", element: <PrivateRoute element={<ProductDetail />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
      {
        path: "/cart",
        element: <PrivateRoute element={<CartPage />} allowedRoles={["CUSTOMER_STAFF", "MANAGER"]} />
      },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

]);

export default AppRouter;
