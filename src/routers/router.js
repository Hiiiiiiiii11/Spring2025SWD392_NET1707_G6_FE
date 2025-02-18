import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Manager from "../pages/Manager";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,  // Sử dụng MainLayout
    children: [
      { path: "/", element: <Home /> },

    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/manager", element: <Manager /> },
]);

export default AppRouter;
