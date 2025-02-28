import React, { useState, useEffect } from 'react';
import { Table, Select, Button } from 'antd';
const { Option } = Select;

const StaffOrders = () => {
  // Dữ liệu mẫu (mock data) thay cho API
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD001',
      customerName: 'Nguyen Van A',
      paymentMethod: 'Credit Card',
      status: 'Delivered',
      total: 65,
    },
    {
      orderId: 'ORD002',
      customerName: 'Tran Thi B',
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      total: 20,
    },
    {
      orderId: 'ORD003',
      customerName: 'Le Van C',
      paymentMethod: 'E-Wallet',
      status: 'Shipped',
      total: 45,
    },
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span style={{ color: text === 'Delivered' ? '#27ae60' : '#e67e22', fontWeight: 'bold' }}>
          {text}
        </span>
      ),
    },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (text) => `$${text}` },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Select
            value={record.status}
            onChange={(value) => updateOrderStatus(record.orderId, value)}
            style={{ width: 120, marginRight: 8 }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
          <Button type="primary">Support Payment</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>All Orders</h1>
      {orders.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No orders found.</p>
      ) : (
        <Table columns={columns} dataSource={orders} rowKey="orderId" />
      )}
    </div>
  );
};

export default StaffOrders;