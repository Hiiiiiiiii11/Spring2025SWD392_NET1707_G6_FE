import React from "react";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div style={{ backgroundColor: "#f2f1f6" }}>
      <div className="main_container">
        <Outlet />
      </div>

    </div>
  );
};

export default CustomerLayout;
