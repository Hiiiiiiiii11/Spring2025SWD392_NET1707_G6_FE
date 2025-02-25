import React, { useState } from "react";
import { Card, Row, Col, Button } from "antd";
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import product5 from "../../assets/product5.jpg";
import product6 from "../../assets/product6.jpg";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import Header from "../../components/Header/Header";

// Danh sách sản phẩm
const productList = [
  { id: 1, image: product1, name: "Sữa Rửa Mặt Trắng Da", brand: "L'Oreal", price: "120.000", originalPrice: "180.000", discount: 33, rating: 4.6, reviews: 198, sold: 3560, gift: "Tặng: Kem Dưỡng Ẩm" },
  { id: 2, image: product2, name: "Son Môi Đỏ Quyến Rũ", brand: "Maybelline", price: "99.000", originalPrice: "149.000", discount: 34, rating: 4.8, reviews: 276, sold: 4220, gift: "Tặng: Son Dưỡng Mini" },
  { id: 3, image: product3, name: "Kem Chống Nắng SPF 50+", brand: "La Roche-Posay", price: "195.000", originalPrice: "250.000", discount: 22, rating: 4.7, reviews: 315, sold: 5890, gift: "Tặng: Mặt Nạ Dưỡng Da" },
  { id: 4, image: product4, name: "Dầu Gội Dưỡng Tóc Mềm Mượt", brand: "TRESemmé", price: "150.000", originalPrice: "210.000", discount: 28, rating: 4.5, reviews: 180, sold: 2780, gift: "Tặng: Dầu Xả 50ml" },
  { id: 5, image: product5, name: "Nước Hoa Hồng Cân Bằng Da", brand: "Innisfree", price: "175.000", originalPrice: "230.000", discount: 24, rating: 4.9, reviews: 410, sold: 6290, gift: "Tặng: Bông Tẩy Trang" },
  { id: 6, image: product6, name: "Tẩy Trang Dịu Nhẹ Cho Da Nhạy Cảm", brand: "Bioderma", price: "135.000", originalPrice: "189.000", discount: 29, rating: 4.8, reviews: 327, sold: 4750, gift: "Tặng: Khăn Lau Mặt" },
];

// Component hiển thị sản phẩm
const ProductCard = ({ product }) => (
  <Card
    hoverable
    cover={<img alt={product.name} src={product.image} style={{ height: "200px", objectFit: "cover" }} />}
  >
    <p style={{ fontWeight: "bold", fontSize: "16px" }}>{product.name}</p>
    <p>Thương hiệu: {product.brand}</p>
    <p style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>{product.price}đ</p>
    <p style={{ textDecoration: "line-through", color: "gray" }}>{product.originalPrice}đ</p>
    <p>Giảm: {product.discount}%</p>
    <p>⭐ {product.rating} ({product.reviews} đánh giá) - Đã bán {product.sold}</p>
    <p style={{ fontSize: "14px", color: "#ff4500" }}>{product.gift}</p>
  </Card>
);

function Home() {
  return (
    <div className="home-page">
      <Header />
      <div className="home-container">
        <BannerSlider />

        {/* Top sản phẩm bán chạy */}
        <div className="product__topsale">
          <p className="product__title">Top sản phẩm bán chạy</p>
          <Row gutter={[16, 16]}>
            {productList.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>

        {/* Gợi ý sản phẩm */}
        <div className="product__topsale">
          <p className="product__title">Gợi ý dành cho bạn</p>
          <Row gutter={[16, 16]}>
            {productList.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="product__topsale">
          <p className="product__title">Danh sách sản phẩm</p>
          <Row gutter={[16, 16]}>
            {productList.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>


      </div>
      <Footer />
    </div>
  );
}

export default Home;
