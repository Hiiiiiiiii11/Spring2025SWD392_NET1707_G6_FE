import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Manager from "../pages/Manager";
import EmployeeProducts from "../pages/EmployeeProducts";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Sử dụng MainLayout làm layout chung
    children: [
      { path: "/", element: <Home /> },
      { path: "/manager", element: <Manager /> },
      { path: "/employee-products", element: <EmployeeProducts /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
]);

export default AppRouter;