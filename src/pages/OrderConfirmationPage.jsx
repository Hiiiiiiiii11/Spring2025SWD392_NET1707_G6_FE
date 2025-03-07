import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Table, Typography, Row, Col, message } from 'antd';
const { Title, Text } = Typography;


const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Dữ liệu mẫu (mock data) cho giỏ hàng và thông tin đơn hàng
  const cartItems = [
    { productId: 'P001', productName: 'Moisturizer Cream', quantity: 2, price: 25.00 },
    { productId: 'P002', productName: 'Sunscreen SPF 50', quantity: 1, price: 15.00 },
  ];

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });

  const paymentMethods = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Cash on Delivery', value: 'cod' },
    { label: 'PayPal', value: 'paypal' },
  ];

  const [selectedPayment, setSelectedPayment] = useState('credit_card');

  // Tính tổng tiền
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Xử lý submit đơn hàng
  const onFinish = (values) => {
    setShippingInfo(values);
    message.success('Order placed successfully! Thank you for your purchase.');
    navigate('/customer/history'); // Điều hướng đến lịch sử đơn hàng sau khi đặt
  };

  // Cột cho bảng sản phẩm
  const columns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price ($)', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
    {
      title: 'Subtotal ($)',
      key: 'subtotal',
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', background: 'linear-gradient(135deg, #a8edea, #fed6e3)', minHeight: '100vh' }}>
      <Title level={2}>Order Confirmation</Title>
      <Card title="Review Your Cart" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={cartItems}
          rowKey="productId"
          pagination={false}
        />
        <p style={{ fontWeight: 'bold', textAlign: 'right' }}>Total: ${total.toFixed(2)}</p>
      </Card>

      <Card title="Shipping Information">
        <Form
          form={form}
          name="shippingForm"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name!' }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number!' }]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter your address!' }]}
          >
            <Input.TextArea placeholder="Enter your address" rows={4} />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter your city!' }]}
          >
            <Input placeholder="Enter your city" />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Payment Method" style={{ marginTop: 24 }}>
        <Form.Item
          name="paymentMethod"
          rules={[{ required: true, message: 'Please select a payment method!' }]}
        >
          <Select
            value={selectedPayment}
            onChange={setSelectedPayment}
            options={paymentMethods}
          />
        </Form.Item>
      </Card>

      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Button type="primary" htmlType="submit" onClick={() => form.submit()}>
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;