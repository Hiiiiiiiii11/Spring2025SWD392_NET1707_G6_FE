import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Row, Col, Spin } from "antd";
import { useLocation } from "react-router-dom";
import { getProductByIdAPI } from "../../services/manageProductService";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ViewCartProductDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const data = await getProductByIdAPI(productId);
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (!product) {
    return <p style={{ textAlign: "center" }}>Product not found.</p>;
  }

  return (
    <div style={{ padding: 24, margin: "0 auto" }}>
      <button className="back-to-product" onClick={() => navigate("/cart")}>
        <ArrowLeftOutlined /> &nbsp;Cart Page
      </button>
      <Title level={2}>Detail Product Cart</Title>
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <img
              src={product.imageURL || "https://via.placeholder.com/200x200"}
              alt={product.productName}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Col>
          <Col span={16}>
            <Title level={4}>{product.productName}</Title>
            <Text strong>Description: {product.description}</Text>
            <p style={{ marginTop: 16 }}>
              <Text strong>Price: </Text>${product.price?.toFixed(2)}
            </p>
            <p>
              <Text strong>Category: </Text>{product.category}
            </p>
            <p>
              <Text strong>For Skin Type: </Text>{product.skinTypeCompatibility}
            </p>
            <p>
              <Text strong>Stock: </Text>{product.stockQuantity}
            </p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ViewCartProductDetail;
