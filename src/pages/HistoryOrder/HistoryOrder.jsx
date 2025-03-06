import React, { useState, useEffect } from 'react';
import { List, Card, Button, Typography } from 'antd';
const { Title, Text } = Typography;

const HistoryOrder = () => {
  // Dữ liệu mẫu (mock data) thay cho API
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD001',
      orderDate: '2025-02-20',
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      items: [
        { productId: 'P001', productName: 'Moisturizer Cream', quantity: 2, price: 25 },
        { productId: 'P002', productName: 'Sunscreen SPF 50', quantity: 1, price: 15 },
      ],
      total: 65,
    },
    {
      orderId: 'ORD002',
      orderDate: '2025-02-15',
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      items: [
        { productId: 'P003', productName: 'Facial Cleanser', quantity: 1, price: 20 },
      ],
      total: 20,
    },
  ]);

  const getStatusColor = (status) => {
    return status === 'Delivered' ? 'success' : 'warning';
  };

  return (
    <div style={{ padding: 24, margin: '0 auto' }}>
      <Title level={2}>History Order</Title>
      {orders.length === 0 ? (
        <Text type="secondary">No orders found.</Text>
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => (
            <List.Item>
              <Card title={`Order #${order.orderId}`} style={{ width: '100%' }}>
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>
                  Status:
                  <Text type={getStatusColor(order.status)} strong>
                    {order.status}
                  </Text>
                </p>
                <p>Payment Method: {order.paymentMethod}</p>
                <p style={{ fontWeight: 'bold', marginTop: 10 }}>Total: ${order.total}</p>
                <Button type="primary" style={{ marginTop: 10 }}>
                  View Details
                </Button>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default HistoryOrder;