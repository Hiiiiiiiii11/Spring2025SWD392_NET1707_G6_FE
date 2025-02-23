import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css'; // Corrected path

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="rating">⭐ {product.rating} / 5</p>
          <p className="description">
            Discover the benefits of {product.name}! This product hydrates, rejuvenates, and protects your skin with natural ingredients. Perfect for daily use.
          </p>
          <button className="add-to-cart" onClick={() => alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)}>
            Thêm vào giỏ hàng
          </button>
          <a href="/products" className="back-to-products">Quay lại danh sách sản phẩm</a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;