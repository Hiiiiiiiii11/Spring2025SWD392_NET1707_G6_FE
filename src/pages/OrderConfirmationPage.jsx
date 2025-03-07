import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Table, Typography, Row, Col, message, Input as AntInput } from 'antd';
const { Title, Text } = Typography;


const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Nhận danh sách sản phẩm được chọn từ CartPage qua state
  const { selectedItems = [] } = location.state || {};

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
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0); // Giảm giá (mock logic)

  // Tính toán chi tiết thanh toán
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 5.00; // Miễn phí vận chuyển nếu đơn hàng > $100, nếu không thì $5
  const finalTotal = subtotal + shippingFee - discount;

  // Xử lý áp dụng mã giảm giá (mock logic)
  const applyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setDiscount(10.00);
      message.success('Discount applied! You saved $10.');
    } else {
      setDiscount(0);
      message.error('Invalid discount code!');
    }
  };

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
        {selectedItems.length === 0 ? (
          <Text type="secondary">No items selected for checkout.</Text>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={selectedItems}
              rowKey="productID"
              pagination={false}
            />
          </>
        )}
      </Card>

      <Card title="Shipping Information" style={{ marginBottom: 24 }}>
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

      <Card title="Payment Method" style={{ marginBottom: 24 }}>
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

      <Card title="Payment Details" style={{ marginBottom: 24 }}>
        <Row justify="space-between">
          <Col><Text>Subtotal:</Text></Col>
          <Col><Text>${subtotal.toFixed(2)}</Text></Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: 8 }}>
          <Col><Text>Shipping Fee:</Text></Col>
          <Col><Text>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</Text></Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: 8 }}>
          <Col><Text>Discount:</Text></Col>
          <Col><Text>-${discount.toFixed(2)}</Text></Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={16}>
            <AntInput
              placeholder="Enter discount code (e.g., SAVE10)"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button onClick={applyDiscount}>Apply</Button>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: 16, borderTop: '1px solid #e8e8e8', paddingTop: 8 }}>
          <Col><Text strong>Final Total:</Text></Col>
          <Col><Text strong>${finalTotal.toFixed(2)}</Text></Col>
        </Row>
      </Card>

      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Button type="primary" htmlType="submit" onClick={() => form.submit()} disabled={selectedItems.length === 0}>
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;