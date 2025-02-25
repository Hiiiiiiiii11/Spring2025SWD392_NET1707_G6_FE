import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import product5 from "../../assets/product5.jpg";
import product6 from "../../assets/product6.jpg";
import './ProductPage.css';
import Footer from '../../components/Footer/Footer';

const { Meta } = Card;

const products = [
  { id: 1, name: 'Sữa Rửa Mặt Trắng Da', price: 120000, rating: 4.6, image: product1, brand: "L'Oreal" },
  { id: 2, name: 'Son Môi Đỏ Quyến Rũ', price: 99000, rating: 4.8, image: product2, brand: "Maybelline" },
  { id: 3, name: 'Kem Chống Nắng SPF 50+', price: 195000, rating: 4.7, image: product3, brand: "La Roche-Posay" },
  { id: 4, name: 'Dầu Gội Dưỡng Tóc Mềm Mượt', price: 150000, rating: 4.5, image: product4, brand: "TRESemmé" },
  { id: 5, name: 'Nước Hoa Hồng Cân Bằng Da', price: 175000, rating: 4.9, image: product5, brand: "Innisfree" },
  { id: 6, name: 'Tẩy Trang Dịu Nhẹ Cho Da Nhạy Cảm', price: 135000, rating: 4.8, image: product6, brand: "Bioderma" },
  { id: 7, name: 'Hydrating Serum', price: 29.99, rating: 4.5, image: product1, brand: "Skincare" },
  { id: 8, name: 'Anti-Aging Cream', price: 39.99, rating: 4.8, image: product2, brand: "Skincare" },
  { id: 9, name: 'Cleansing Gel', price: 19.99, rating: 4.2, image: product3, brand: "Skincare" },
];

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productName) => {
    alert(`✅ Đã thêm "${productName}" vào giỏ hàng!`)
  };

  return (
    <div>
      <Header />
      <div className="product-page">
        <h1>Skincare Products</h1>
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', maxWidth: '400px' }}
        />
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button type="primary" onClick={() => addToCart(product.name)}>
                    Thêm vào giỏ hàng
                  </Button>,
                  <Link to={`/product/${product.id}`}>Xem chi tiết</Link>,
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <>
                      <p className="price">
                        {product.price > 1000 ? product.price.toLocaleString() + 'đ' : '$' + product.price.toFixed(2)}
                      </p>
                      <p className="rating">⭐ {product.rating} / 5</p>
                      {product.brand && <p className="brand">Thương hiệu: {product.brand}</p>}
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
