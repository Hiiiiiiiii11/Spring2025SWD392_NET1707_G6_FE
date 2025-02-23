import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";

import Register from "../pages/Register/Register";
import ProductPage from "../pages/ProductPage/ProductPage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Manager from "../pages/ManageProduct/Manager";
import Login from "../pages/Login/Login";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import CustomerLayout from "../layout/CustomerLayout/CustomerLayout";
import Home from "../pages/Home/Home";

const products = [ // Example products data
  { id: 1, name: 'Hydrating Serum', price: 29.99, rating: 4.5, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Anti-Aging Cream', price: 39.99, rating: 4.8, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Cleansing Gel', price: 19.99, rating: 4.2, image: 'https://via.placeholder.com/150' },
];

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/manager", element: <Manager /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      {
        path: "/product/:id",
        element: <ProductDetail />,
        loader: ({ params }) => {
          const product = products.find(p => p.id === parseInt(params.id));
          if (!product) {
            throw new Response("Not Found", { status: 404 });
          }
          return product;
        },
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

export default AppRouter;