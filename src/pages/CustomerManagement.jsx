import React, { useState } from 'react';
import { Table, Input, Button, Typography } from 'antd';
const { Title, Text } = Typography;

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([
    { id: 'C001', name: 'Nguyen Van A', email: 'a@example.com', phone: '0123456789', orders: 3, feedback: 'Good service' },
    { id: 'C002', name: 'Tran Thi B', email: 'b@example.com', phone: '0987654321', orders: 1, feedback: 'Average' },
  ]);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) || 
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Orders', dataIndex: 'orders', key: 'orders' },
    { title: 'Feedback', dataIndex: 'feedback', key: 'feedback' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Customer Management</Title>
      <Input.Search
        placeholder="Search by name or email"
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table columns={columns} dataSource={filteredCustomers} rowKey="id" />
    </div>
  );
};

export default CustomerManagement;