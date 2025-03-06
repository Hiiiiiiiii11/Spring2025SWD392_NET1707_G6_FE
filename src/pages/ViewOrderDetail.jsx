import React from 'react';
import { Table, Typography, Tag } from 'antd';
const { Title, Text } = Typography;

// Dữ liệu mẫu (mock data) cho chi tiết đơn hàng, giả định lấy từ URL param (orderId)
const ViewOrderDetail = () => {
  // Mock data cho chi tiết đơn hàng dựa trên orderId (giả sử lấy từ URL)
  const orderId = new URLSearchParams(window.location.search).get('orderId') || 'ORDER001';
  const orderDetails = {
    orderId: orderId,
    customerName: 'Nguyen Van A',
    orderDate: '2025-03-05',
    totalAmount: 75.00,
    status: 'Shipped',
    items: [
      {
        productId: 'P001',
        productName: 'Moisturizer Cream',
        quantity: 2,
        price: 25.00,
        subtotal: 50.00,
      },
      {
        productId: 'P002',
        productName: 'Sunscreen SPF 50',
        quantity: 1,
        price: 25.00,
        subtotal: 25.00,
      },
    ],
  };

  // Columns cho bảng chi tiết sản phẩm
  const columns = [
    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price ($)', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
    { title: 'Subtotal ($)', dataIndex: 'subtotal', key: 'subtotal', render: (text) => `$${text.toFixed(2)}` },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Order Details - {orderId}</Title>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Customer Name:</Text> {orderDetails.customerName}<br />
        <Text strong>Order Date:</Text> {new Date(orderDetails.orderDate).toLocaleDateString()}<br />
        <Text strong>Total Amount:</Text> ${orderDetails.totalAmount.toFixed(2)}<br />
        <Text strong>Status:</Text> <Tag color={orderDetails.status === 'Shipped' ? 'green' : 'orange'}>{orderDetails.status}</Tag>
      </div>
      <Table
        columns={columns}
        dataSource={orderDetails.items}
        rowKey="productId"
        pagination={false}
      />
    </div>
  );
};

export default ViewOrderDetail;