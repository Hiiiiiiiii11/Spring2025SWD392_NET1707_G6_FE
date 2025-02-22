import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";





import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";

import ProductPage from "../pages/ProductPage/ProductPage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Manager from "../pages/ManageProduct/Manager";
import Login from "../pages/Login/Login";


const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/manager", element: <Manager /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: < Register /> },

]);

export default AppRouter;
