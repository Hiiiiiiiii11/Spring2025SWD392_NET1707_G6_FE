import { Link } from 'react-router-dom';
import React from 'react';
import { Table, Typography, Tag, Space, Button } from 'antd'; // Thêm Button vào import
const { Title, Text } = Typography;
 // Đảm bảo import ở đầu file

const HistoryOrder = () => {
  // Dữ liệu mẫu (mock data) cho lịch sử đơn hàng
  const orders = [
    {
      id: 'ORDER001',
      customer: 'Nguyen Van A',
      total: 75.00,
      status: 'Delivered',
      date: '2025-03-05',
    },
    {
      id: 'ORDER002',
      customer: 'Tran Thi B',
      total: 25.00,
      status: 'Pending',
      date: '2025-03-04',
    },
    {
      id: 'ORDER003',
      customer: 'Le Van C',
      total: 45.00,
      status: 'Shipped',
      date: '2025-03-03',
    },
  ];

  // Columns cho bảng lịch sử đơn hàng
  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Total ($)', dataIndex: 'total', key: 'total', render: (text) => `$${text.toFixed(2)}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Delivered' ? 'green' : status === 'Shipped' ? 'blue' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (text) => new Date(text).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/view-order-detail?orderId=${record.id}`}>
            <Button type="primary">View Details</Button> {/* Sử dụng Button từ AntD */}
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Order History</Title>
      {orders.length === 0 ? (
        <Text type="secondary">No orders found.</Text>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default HistoryOrder;