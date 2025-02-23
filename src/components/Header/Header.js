import { useState } from "react";
import "./Header.css";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="topnav_container">
      <div className="nav__container">
        <div className="nav-link">
          <a className="active" href="#home">
            Home
          </a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </div>

        <form className="search__box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for skincare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="auth-link">
          <a href="/login" className="btn_login">
            Login
          </a>
          <a href="/register" className="btn_register">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
