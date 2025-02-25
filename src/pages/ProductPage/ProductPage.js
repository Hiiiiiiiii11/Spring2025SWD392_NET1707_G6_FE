import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ProductPage.css';
import { getAllProductAPI } from '../../services/manageProductService';

const { Meta } = Card;

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productData, setProductData] = useState([]);

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) setProductData(data);
    };
    fetchProducts();
  }, []);

  // Filter products only if a search term is provided; otherwise show all products
  const filteredProducts = searchTerm
    ? productData.filter((product) =>
      product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : productData;

  // Handler for adding product to cart
  const addToCart = (productName) => {
    alert(`✅ Added "${productName}" to your cart!`);
  };

  return (
    <div>
      <Header />
      <div className="product-page">
        <h1>Skincare Products</h1>
        <Input
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', maxWidth: '400px' }}
        />
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.productName}
                    src={
                      product.imageURL ||
                      "https://via.placeholder.com/200x200?text=No+Image"
                    }
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => addToCart(product.productName)}
                  >
                    Add to Cart
                  </Button>,
                  <Link to={`/product/${product.productID}`}>View Details</Link>,
                ]}
              >
                <Meta
                  title={product.productName}
                  description={
                    <>
                      <p className="price">
                        {product.price > 1000
                          ? product.price.toLocaleString() + 'đ'
                          : '$' + product.price.toFixed(2)}
                      </p>
                      {/* <p className="rating">⭐ {product.rating} / 5</p> */}

                      {product.category && (
                        <p className="brand">Category: {product.category}</p>
                      )}
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
