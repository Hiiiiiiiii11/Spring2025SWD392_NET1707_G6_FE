import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button, Modal, InputNumber } from "antd";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ProductPage.css";
import { getAllProductAPI } from "../../services/manageProductService";
import { AddProductToCartAPI } from "../../services/cartService";

const { Meta } = Card;

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productData, setProductData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  // Mở Modal chọn số lượng
  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset số lượng về 1
    setIsModalVisible(true);
  };

  // Xử lý thêm vào giỏ hàng sau khi chọn số lượng
  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      const response = await AddProductToCartAPI({
        productId: selectedProduct.productID,
        quantity,
      });

      if (response) {
        alert(`✅ Added "${selectedProduct.productName}" x${quantity} to cart!`);
      } else {
        alert("❌ Failed to add product to cart!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("❌ Error adding product to cart!");
    }

    setIsModalVisible(false);
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
          style={{ marginBottom: "20px", maxWidth: "400px" }}
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
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => openQuantityModal(product)}
                  >
                    Add to Cart
                  </Button>,
                  <Link to={`/products/${product.productID}`}>View Details</Link>,
                ]}
              >
                <Meta
                  title={product.productName}
                  description={
                    <>
                      <p className="price">
                        {product.price > 1000
                          ? product.price.toLocaleString() + "đ"
                          : "$" + product.price.toFixed(2)}
                      </p>
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

      {/* Modal chọn số lượng */}
      <Modal
        title="Select Quantity"
        open={isModalVisible}
        onOk={handleAddToCart}
        onCancel={() => setIsModalVisible(false)}
        okText="Add to Cart"
      >
        {selectedProduct && (
          <>
            <p>
              Adding: <strong>{selectedProduct.productName}</strong>
            </p>
            <InputNumber
              min={1}
              max={99}
              value={quantity}
              onChange={setQuantity}
              style={{ width: "200px", height: "40px", fontSize: "15px", display: "flex", alignItems: "center" }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;
