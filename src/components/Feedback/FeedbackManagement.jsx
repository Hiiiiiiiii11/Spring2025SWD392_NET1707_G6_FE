import React, { useState } from 'react';
import { Table, Rate, Input, Button, Typography } from 'antd';
const { Title, Text } = Typography;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 'F001', customer: 'Nguyen Van A', product: 'Moisturizer Cream', rating: 4, comment: 'Very good product!', date: '2025-02-20' },
    { id: 'F002', customer: 'Tran Thi B', product: 'Sunscreen SPF 50', rating: 3, comment: 'Average, needs improvement.', date: '2025-02-15' },
  ]);
  const [search, setSearch] = useState('');

  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.customer.toLowerCase().includes(search.toLowerCase()) || 
    feedback.product.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (text) => <Rate disabled value={text} /> },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Feedback Management</Title>
      <Input.Search
        placeholder="Search by customer or product"
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table columns={columns} dataSource={filteredFeedbacks} rowKey="id" />
    </div>
  );
};

export default FeedbackManagement;