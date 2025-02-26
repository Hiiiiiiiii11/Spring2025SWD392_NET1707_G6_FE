import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";

// Danh sách sản phẩm
const productList = [
  {
    id: 1,
    image: product1,
    name: "Sữa Rửa Mặt Trắng Da",
    brand: "L'Oreal",
    price: "120.000",
    originalPrice: "180.000",
    discount: 33,
    rating: 4.6,
    reviews: 198,
    sold: 3560,
    gift: "Tặng: Kem Dưỡng Ẩm",
  },
  {
    id: 2,
    image: product2,
    name: "Son Môi Đỏ Quyến Rũ",
    brand: "Maybelline",
    price: "99.000",
    originalPrice: "149.000",
    discount: 34,
    rating: 4.8,
    reviews: 276,
    sold: 4220,
    gift: "Tặng: Son Dưỡng Mini",
  },
  {
    id: 3,
    image: product3,
    name: "Kem Chống Nắng SPF 50+",
    brand: "La Roche-Posay",
    price: "195.000",
    originalPrice: "250.000",
    discount: 22,
    rating: 4.7,
    reviews: 315,
    sold: 5890,
    gift: "Tặng: Mặt Nạ Dưỡng Da",
  },
  {
    id: 4,
    image: product4,
    name: "Dầu Gội Dưỡng Tóc Mềm Mượt",
    brand: "TRESemmé",
    price: "150.000",
    originalPrice: "210.000",
    discount: 28,
    rating: 4.5,
    reviews: 180,
    sold: 2780,
    gift: "Tặng: Dầu Xả 50ml",
  },
  {
    id: 5,
    image: product5,
    name: "Nước Hoa Hồng Cân Bằng Da",
    brand: "Innisfree",
    price: "175.000",
    originalPrice: "230.000",
    discount: 24,
    rating: 4.9,
    reviews: 410,
    sold: 6290,
    gift: "Tặng: Bông Tẩy Trang",
  },
  {
    id: 6,
    image: product6,
    name: "Tẩy Trang Dịu Nhẹ Cho Da Nhạy Cảm",
    brand: "Bioderma",
    price: "135.000",
    originalPrice: "189.000",
    discount: 29,
    rating: 4.8,
    reviews: 327,
    sold: 4750,
    gift: "Tặng: Khăn Lau Mặt",
  },
];

// Component hiển thị sản phẩm

function Home() {
  const [products, setProducts] = useState([]);

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <Header />
      <div className="home-container">
        <BannerSlider />

        {/* Top Selling Products Section */}
        <div className="product__topsale">
          <p className="product__title">Top Selling Products</p>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>

        {/* Recommended Products Section */}
        <div className="product__topsale">
          <p className="product__title">Recommended For You</p>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>

        {/* All Products Section */}
        <div className="product__topsale">
          <p className="product__title">All Products</p>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
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
