import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // If location.pathname is "/" then set active to Home
  const currentPath = location.pathname === "/" ? "/" : location.pathname;
  const token = sessionStorage.getItem("token");

  // Default role and user info
  let staffId = "";
  let customerId = "";
  let role = "guest";
  let userInfo = null;
  let staffEmail = "";

  // If token exists, decode it to get user info and role
  if (token) {
    try {
      userInfo = jwtDecode(token);
      // Assume the decoded token contains a field "role"
      role = userInfo.role;
      sessionStorage.setItem("role", role);
      customerId = userInfo.customerId;
      sessionStorage.setItem("customerId", customerId);
      staffId = userInfo.staffId;
      sessionStorage.setItem("staffId", staffId);
      staffEmail = userInfo.sub;
      sessionStorage.setItem("staffEmail", staffEmail);

    } catch (error) {
      role = "guest";
    }
  }

  // Define main menu items based on role
  let menuItems = [];
  if (role === "MANAGER") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "Manage Product", path: "/manage_product" },
      { label: "Manage Employee", path: "/manage-staff" },
      { label: "Manage Promotion", path: "/promotion" },
      { label: "Manage Quiz", path: "/manage-quiz" },
      { label: "View Order", path: "/manager-orders" },
    ];
  } else if (role === "CUSTOMER_STAFF") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "View Order", path: "/manager-orders" },
      { label: "Order Request", path: "/manager-request-orders" },
    ];
  } else if (role === "CUSTOMER") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
    ];
  } else if (role === "guest") {
    menuItems = [
      { label: "Home", path: "/" },

    ];
  } else if (role === "DELIVERY_STAFF") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "View Order", path: "/manager-orders" },
      { label: "Return Order", path: "/manager-request-return" },
    ];
  }
  const handleNavigate = (path) => {
    navigate(path);
  };

  // User dropdown menu items (only for logged-in users)
  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => navigate("/profile")
    },
    role === "CUSTOMER" && {
      key: "historyorder",
      label: "History Order",
      onClick: () => navigate("/historyorders"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("loginSuccess");
        navigate("/login");
      },
    },
  ].filter(Boolean); // ✅ Loại bỏ các phần tử `false` hoặc `undefined`


  const userMenu = (
    <Menu
      items={userMenuItems}
      onClick={(e) => {
        // Optional: Additional onClick logic here
      }}
    />
  );

  return (
    <div className="topnav_container">
      <div className="nav__container">
        <div className="nav-link">
          {menuItems.map((item) => (
            <a
              key={item.path}
              className={currentPath === item.path ? "active" : ""}
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="auth-link">
          {role === "guest" ? (
            <>
              <a onClick={() => handleNavigate("/login")} className="btn_login">
                Login
              </a>
              <a onClick={() => handleNavigate("/register")} className="btn_register">
                Sign up
              </a>
            </>
          ) : (
            <span className="cart-user-icon-sub">
              {role === "CUSTOMER" && (
                <span className="cart-icon" onClick={() => handleNavigate("/cart")}><ShoppingCartOutlined /></span>
              )}

              <Dropdown overlay={userMenu} trigger={["click"]}>

                <span className="user-icon-sub">


                  <span><UserOutlined /></span>
                  <span className="span-user-sub">{userInfo && userInfo.sub}</span>

                </span>

              </Dropdown>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
