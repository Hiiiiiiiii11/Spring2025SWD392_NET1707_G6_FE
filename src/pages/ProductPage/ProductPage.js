import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button, Modal, InputNumber } from "antd";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ProductPage.css";
import { getAllProductAPI } from "../../services/manageProductService";
import { AddProductToCartAPI, GetAllProductCartAPI } from "../../services/cartService";

const { Meta } = Card;

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productData, setProductData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) setProductData(data);
    };
    fetchProducts();
  }, []);

  const filteredProducts = searchTerm
    ? productData.filter((product) =>
      product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : productData;

  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalVisible(true);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      // Lấy danh sách sản phẩm trong giỏ hàng
      let cartItems = await GetAllProductCartAPI();

      // Kiểm tra nếu cartItems không phải là mảng, đặt giá trị mặc định []
      cartItems = Array.isArray(cartItems) ? cartItems : [];

      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cartItems.find(item => item.product.productID === selectedProduct.productID);
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;

      // Kiểm tra tổng số lượng đã có trong giỏ hàng
      if (currentCartQuantity + quantity > selectedProduct.stockQuantity) {
        alert("❌ You cannot add more of this product. Stock limit reached!");
        return;
      }

      // Gọi API thêm sản phẩm vào giỏ hàng
      const response = await AddProductToCartAPI({
        product: selectedProduct,
        quantity,
      });

      if (response) {
        alert(`✅ Added "${selectedProduct.productName}" x${quantity} to cart!`);
      } else {
        alert("❌ Failed to add product to cart!");
      }
    } catch (error) {
      alert("❌ Error adding product to cart! Session Time Out!!!");
    }

    setIsModalVisible(false);
  };




  return (
    <div>
      <Header />
      <div className="product-page">
        <h1>Skincare Products</h1>
        <div className="search-product-page">
          <Input
            placeholder="Search products..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "20px", maxWidth: "400px" }}
          />
        </div>
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          {filteredProducts.map((product) => (
            <Col key={product.productID} xs={24} sm={12} md={6} lg={6} xl={6}>
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
                    disabled={role !== "CUSTOMER"} // Chỉ CUSTOMER mới có thể nhấn
                  >
                    Add to Cart
                  </Button>
                  ,
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
                      <p className="available-product">✅Available Product: {product.stockQuantity}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />

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
              style={{ width: "200px", height: "40px", fontSize: "15px" }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;
