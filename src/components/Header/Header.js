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
  let role = "guest";
  let userInfo = null;

  // If token exists, decode it to get user info and role
  if (token) {
    try {
      userInfo = jwtDecode(token);
      // Assume the decoded token contains a field "role"
      role = userInfo.role;
      sessionStorage.setItem("role", role);

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
      { label: "View Order", path: "/view-order" },
    ];
  } else if (role === "CUSTOMER_STAFF") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "View Order", path: "/view-order" },
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
  }

  const handleNavigate = (path) => {
    navigate(path);
  };

  // User dropdown menu items (only for logged-in users)
  const userMenuItems = [
    { key: "profile", label: "Profile", onClick: () => navigate("/profile") },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        navigate("/login");
      },
    },
  ];

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
              <span className="cart-icon" onClick={() => handleNavigate("/cart")}><ShoppingCartOutlined /></span>

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
