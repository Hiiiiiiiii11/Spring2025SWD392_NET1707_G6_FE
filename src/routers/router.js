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
import PrivateRoute from "./privateRouter";
import SkinTypeQuiz from "../pages/SkinTypeQuiz";
import CompareProducts from "../pages/CompareProducts";
import Promotion from "../pages/Promotion";
import Blog from "../pages/Blog";
import News from "../pages/News";
import FAQ from "../pages/FAQ";
import ProfileDetail from "../pages/ProfileDetail";

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
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <PrivateRoute element={<CartPage />} allowedRoles={["CUSTOMER", "MANAGER", "CUSTOMER_STAFF"]} /> },
      { path: "/customer/orders", element: <CustomerOrders /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/promotion", element: <Promotion/>},
      { path: "/skin-type-quiz", element: <SkinTypeQuiz/>},
      { path: "/compare-products", element: <CompareProducts/>},
      { path: "/blog", element: <Blog/>},
      { path: "/news", element: <News/>},
      { path: "/faq", element: <FAQ/>},
      { path: "/profile", element: <ProfileDetail/>},
      
      {
        path: "/manage-staff",
        element: <PrivateRoute element={<ManagerStaff />} allowedRoles={["MANAGER"]} />
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
