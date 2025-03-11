import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { Card, Table, Statistic, Typography, Button } from 'antd';
import Header from '../../components/Header/Header';
const { Title } = Typography;

const ManageOrders = () => {
  const chartRef = useRef(null); // Thêm useRef để quản lý Chart instance

  const [orders, setOrders] = useState([]);

  const [stats, setStats] = useState({
  });

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Phá hủy biểu đồ cũ trước khi tạo mới
    }

    const ctx = document.getElementById('paymentChart');

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Phá hủy biểu đồ khi component bị unmount
      }
    };
  }, [stats]);

  return (
    <div>
      <Header />
      <div style={{ padding: 24, margin: '0 auto' }}>
        <Title level={2}>Order Management Dashboard</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Card>
            <Statistic title="Total Revenue" value={stats.totalRevenue} prefix="$" />
          </Card>
          <Card>
            <Statistic title="Total Orders" value={stats.totalOrders} />
          </Card>
        </div>
        {/* <Card title="Payment Methods Statistics" style={{ marginBottom: 16 }}>
        <canvas id="paymentChart"></canvas> 
      </Card> */}
        <Table
          columns={[
            { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
            { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
            { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (text) => <span style={{ color: text === 'Delivered' ? '#27ae60' : '#e67e22', fontWeight: 'bold' }}>{text}</span>,
            },
            { title: 'Total', dataIndex: 'total', key: 'total', render: (text) => `$${text}` },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button type="primary" onClick={() => setOrders(orders.map(order => order.orderId === record.orderId ? { ...order, status: 'Processed' } : order))}>
                  Manage
                </Button>
              ),
            },
          ]}
          dataSource={orders}
          rowKey="orderId"
        />
      </div>
    </div>
  );
};

export default ManageOrders;
