import { CarryOutFilled, StarFilled } from "@ant-design/icons";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.discount && <div className="discount-badge">{product.discount}%</div>}
        {product.gift && <div className="gift-tag">🎁 {product.gift}</div>}
      </div>

      <div className="product-info">
        <p className="productCart-price">
          {product.price} đ{" "}
          {product.originalPrice && (
            <span className="original-price">{product.originalPrice} đ</span>
          )}
        </p>
        <p className="product-brand">{product.brand}</p>
        <p className="product-name">{product.name}</p>

        {/* Đánh giá & lượt mua */}
        <div className="product-rating">
          <span className="rating">
            <StarFilled /> {product.rating}
          </span>
          <span className="rating-count">({product.reviews})</span>
          <span className="sold">
            <CarryOutFilled /> {product.sold}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
