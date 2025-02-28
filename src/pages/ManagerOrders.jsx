import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { Card, Table, Statistic, Typography, Button } from 'antd';
const { Title } = Typography;

const ManagerOrders = () => {
  const chartRef = useRef(null); // Thêm useRef để quản lý Chart instance

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

  const [stats, setStats] = useState({
    totalRevenue: 130,
    totalOrders: 3,
    paymentStats: { 'Credit Card': 1, 'Cash on Delivery': 1, 'E-Wallet': 1 },
  });

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Phá hủy biểu đồ cũ trước khi tạo mới
    }

    const ctx = document.getElementById('paymentChart'); 
    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(stats.paymentStats || {}),
        datasets: [
          {
            label: 'Payment Methods Usage',
            data: Object.values(stats.paymentStats || {}),
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          },
        ],
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Phá hủy biểu đồ khi component bị unmount
      }
    };
  }, [stats]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Order Management Dashboard</Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
        <Card>
          <Statistic title="Total Revenue" value={stats.totalRevenue} prefix="$" />
        </Card>
        <Card>
          <Statistic title="Total Orders" value={stats.totalOrders} />
        </Card>
      </div>
      <Card title="Payment Methods Statistics" style={{ marginBottom: 16 }}>
        <canvas id="paymentChart"></canvas> {/* Thay Chart component bằng canvas */}
      </Card>
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
  );
};

export default ManagerOrders;
