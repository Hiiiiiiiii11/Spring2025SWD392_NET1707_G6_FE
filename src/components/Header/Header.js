import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu location.pathname là "/" thì mặc định active Home
  const currentPath = location.pathname === "/" ? "/" : location.pathname;

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  }

  const handleNavigateProduct = () => {
    navigate('/products');
  };
  const handleNavigateRegister = () => {
    navigate('/register')
  }

  return (
    <div className="topnav_container">
      <div className="nav__container">
        <div className="nav-link">
          <a
            className={currentPath === '/' ? 'active' : ''}
            onClick={handleNavigateHome}
          >
            Home
          </a>
          <a
            className={currentPath === '/products' ? 'active' : ''}
            onClick={handleNavigateProduct}
          >
            Products
          </a>
        </div>

        <div className="auth-link">
          <a onClick={handleNavigateLogin} className="btn_login">
            Login
          </a>
          <a onClick={handleNavigateRegister} className="btn_register">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
