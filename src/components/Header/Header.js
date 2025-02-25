import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

function Header({ userInfo }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu location.pathname là "/" thì mặc định active Home
  const currentPath = location.pathname === "/" ? "/" : location.pathname;

  // Các hàm điều hướng
  const handleNavigate = (path) => {
    navigate(path);
  };
  const role = "guest"
  // Định nghĩa các menu theo role
  let menuItems = [];
  if (role === "manager") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "Manage Product", path: "/manage-product" },
      { label: "Manage Employee", path: "/manage-employee" },
      { label: "View Order", path: "/view-order" },
    ];
  } else if (role === "employee") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "View Order", path: "/view-order" },
    ];
  } else if (role === "customer") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
    ];
  } else if (role === "guest") {
    menuItems = [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
    ];
  }

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
          {role === "guest" && (
            <>
              <a onClick={() => handleNavigate("/login")} className="btn_login">
                Login
              </a>
              <a onClick={() => handleNavigate("/register")} className="btn_register">
                Sign up
              </a>
            </>



          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
