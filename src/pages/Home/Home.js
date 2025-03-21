import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./Home.css";
import { getAllProductAPI } from "../../services/manageProductService";
import Blog from "../../components/Blog/Blog";
import FAQ from "../../components/FAQ/FAQ";
import News from "../../components/News/News";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Meta } = Card;

// ProductCard component that displays a product from API
const ProductCard = ({ product }) => (
  <Card
    hoverable
    cover={
      <img
        alt={product.productName}
        src={product.imageURL || "https://via.placeholder.com/200x200?text=No+Image"}
        style={{ height: "200px", objectFit: "cover" }}
      />
    }
  >
    <p style={{ fontWeight: "bold", fontSize: "16px" }}>
      {product.productName}
    </p>
    <p>Category: {product.category}</p>
    <p style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>
      ${product.price}
    </p>
    {/* <p
      style={{
        fontSize: "14px",
        color: "#555",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {product.description}
    </p> */}
    <p style={{ fontSize: "12px", color: "#999", height: "30px" }}>
      Skin Type: {product.skinTypeCompatibility}
    </p>
  </Card>
);

function Home() {
  const [products, setProducts] = useState([]);

  // Fetch products from API when component mounts
  useEffect(() => {
    const loginSuccess = sessionStorage.getItem("loginSuccess");
    if (loginSuccess) {
      toast.success("Login successful!");
    }
    setTimeout(() => {
      sessionStorage.removeItem("loginSuccess");
    }, 1000);
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <ToastContainer />
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
              <Col key={product.productID} xs={24} sm={12} md={6} lg={6} xl={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
        <Blog />
        <News />

      </div>
      <Footer />
    </div>
  );
}

export default Home;
