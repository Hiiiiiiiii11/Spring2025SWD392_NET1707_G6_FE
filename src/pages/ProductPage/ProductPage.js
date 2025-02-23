import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../ProductPage/ProductPage.css';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Header from '../../components/Header';

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  const products = [
    { id: 1, name: 'Hydrating Serum', price: 29.99, rating: 4.5, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Anti-Aging Cream', price: 39.99, rating: 4.8, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Cleansing Gel', price: 19.99, rating: 4.2, image: 'https://via.placeholder.com/150' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productName) => {
    setCartMessage(`✅ Đã thêm "${productName}" vào giỏ hàng!`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  return (
    <div>
      <Header />
      <div className="product-page">
        <h1>Skincare Products</h1>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {cartMessage && <div className="cart-message">{cartMessage}</div>}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="rating">⭐ {product.rating} / 5</p>
              <button className="add-to-cart" onClick={() => addToCart(product.name)}>
                Thêm vào giỏ hàng
              </button>
              <Link to={`/product/${product.id}`} className="view-details">Xem chi tiết</Link>
            </div>
          ))}
        </div>
        <footer className="footer">
          <div className="footer-section">
            <p>About Us: Radiant, healthy skin care.</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
            </div>
          </div>
          <div className="footer-section">
            <p>Email: support@skincare.com</p>
            <p>Phone: +1 800 123 4567</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductPage;