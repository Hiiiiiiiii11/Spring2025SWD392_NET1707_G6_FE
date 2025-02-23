import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const CustomerLayout = () => {
  return (
    <div style={{ backgroundColor: "#f2f1f6" }}>
      <Header />
      <div className="main_container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
