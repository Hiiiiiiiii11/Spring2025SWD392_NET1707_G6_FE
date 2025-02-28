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
      { path: "/products", element: <ProductPage /> },
      {
        path: "/manage-staff",
        element: <PrivateRoute element={<ManagerStaff />} allowedRoles={["MANAGER"]} />
      },
      {
        path: "/forgot-password",
        element: <PrivateRoute element={<ForgotPassword />} allowedRoles={["GUEST"]} />
      },
      { path: "/products/:id", element: <ProductDetail /> },
      {
        path: "/cart",
        element: <PrivateRoute element={<CartPage />} allowedRoles={["CUSTOMER_STAFF", "MANAGER"]} />
      },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

export default AppRouter;