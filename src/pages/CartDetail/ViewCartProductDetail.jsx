import React from 'react';
import { Card, Typography, Button, InputNumber, Row, Col, Space, message } from 'antd';
const { Title, Text } = Typography;

const ViewCartProductDetail = () => {
  // Dữ liệu mẫu (mock data) cho chi tiết sản phẩm trong giỏ hàng, lấy từ URL param (productId)
  const productId = new URLSearchParams(window.location.search).get('productId') || 'P001';
  const cartProduct = {
    productId: productId,
    productName: 'Moisturizer Cream',
    description: 'A hydrating cream for all skin types, enriched with natural ingredients.',
    price: 25.00,
    quantity: 2,
    image: 'https://via.placeholder.com/200x200', // Placeholder image
  };

  const [quantity, setQuantity] = React.useState(cartProduct.quantity);

  // Xử lý cập nhật số lượng
  const handleQuantityChange = (value) => {
    if (value >= 0) {
      setQuantity(value);
      message.success(`Quantity updated to ${value}`);
    }
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemove = () => {
    message.success(`Product ${cartProduct.productName} removed from cart!`);
    // Logic xóa (mock) - bạn có thể tích hợp với CartPage state
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>Cart Product Detail - {cartProduct.productName}</Title>
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <img src={cartProduct.image} alt={cartProduct.productName} style={{ width: '100%', borderRadius: 8 }} />
          </Col>
          <Col span={16}>
            <Title level={4}>{cartProduct.productName}</Title>
            <Text>{cartProduct.description}</Text>
            <p style={{ marginTop: 16 }}>
              <Text strong>Price: </Text>${cartProduct.price.toFixed(2)}
            </p>
            <p>
              <Text strong>Quantity: </Text>
              <InputNumber
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: 100 }}
              />
            </p>
            <p>
              <Text strong>Subtotal: </Text>${(cartProduct.price * quantity).toFixed(2)}
            </p>
            <Space style={{ marginTop: 16 }}>
              <Button type="primary" onClick={handleQuantityChange}>
                Update Quantity
              </Button>
              <Button danger onClick={handleRemove}>
                Remove from Cart
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ViewCartProductDetail;