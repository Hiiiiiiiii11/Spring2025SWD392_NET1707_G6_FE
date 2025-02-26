import React from "react";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./routers/router";
import "antd/dist/reset.css";

function App() {
  return <RouterProvider router={AppRouter} />;
}

export default App;
