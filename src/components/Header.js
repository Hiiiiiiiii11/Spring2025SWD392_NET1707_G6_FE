import { useState } from 'react';
import '../components/Header.css';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Thêm logic tìm kiếm tại đây (chẳng hạn chuyển hướng hoặc lọc sản phẩm)
    };

    return (
        <div className="topnav">
            <div className="nav-links">
                <a className="active" href="#home">Home</a>
                <a href="#products">Products</a>
                <a href="#contact">Contact</a>
                <a href="#about">About</a>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for skincare..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">🔍</button>
            </form>

            <div className="auth-links">
                <a href="#login">Login</a>
                <a href="#register">Register</a>
            </div>
        </div>
    );
}

export default Header;
