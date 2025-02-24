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
      </div>
    </div>
  );
};

export default ProductPage;